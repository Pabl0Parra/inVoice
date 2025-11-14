import { type FC, useEffect, useRef, useState } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import type { SpeechRecognitionStatus } from '../../types';

interface VoiceVisualizerProps {
  status: SpeechRecognitionStatus;
  className?: string;
}

/**
 * Audio visualization component for voice input
 * Shows real-time audio waveform when microphone is active
 */
export const VoiceVisualizer: FC<VoiceVisualizerProps> = ({
  status,
  className = '',
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Only set up audio when listening
    if (status === 'listening') {
      // Request microphone access
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Create MediaRecorder for visualization
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          recorder.start();

          // Create audio context for visualization
          audioContextRef.current = new AudioContext();
        })
        .catch((error) => {
          console.error('Error accessing microphone for visualization:', error);
        });

      return () => {
        // Cleanup when status changes
        if (mediaRecorder) {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        setMediaRecorder(null);
      };
    }
  }, [status]);

  // Only show visualizer when actively listening
  if (status !== 'listening' || !mediaRecorder) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center h-16 ${className}`}>
      <LiveAudioVisualizer
        mediaRecorder={mediaRecorder}
        width={200}
        height={50}
        barWidth={2}
        gap={2}
        barColor={'#3B82F6'}
        fftSize={512}
        maxDecibels={-10}
        minDecibels={-90}
        smoothingTimeConstant={0.4}
      />
    </div>
  );
};

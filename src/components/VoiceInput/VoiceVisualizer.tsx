import { type FC, useEffect, useRef } from 'react';
import type { SpeechRecognitionStatus } from '../../types';

interface VoiceVisualizerProps {
  status: SpeechRecognitionStatus;
  className?: string;
}

/**
 * Custom audio visualization component for voice input
 * Uses Web Audio API to create real-time waveform visualization
 * Compatible with React 19
 */
export const VoiceVisualizer: FC<VoiceVisualizerProps> = ({
  status,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (status !== 'listening') {
      // Cleanup when not listening
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      return;
    }

    // Set up audio visualization when listening
    const setupAudioVisualization = async () => {
      try {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Create audio context and analyser
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray: Uint8Array<ArrayBuffer> = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // Start animation
        draw();
      } catch (error) {
        console.error('Error setting up audio visualization:', error);
      }
    };

    const draw = () => {
      if (status !== 'listening') return;

      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      if (!canvas || !analyser || !dataArray) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bars
      const barWidth = (canvas.width / dataArray.length) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#3B82F6'); // blue-500
        gradient.addColorStop(1, '#60A5FA'); // blue-400

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    setupAudioVisualization();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [status]);

  // Don't render if not listening
  if (status !== 'listening') {
    return null;
  }

  return (
    <div className={`flex justify-center items-center ml-[60px] ${className}`}>
      <canvas
        ref={canvasRef}
        width={400}
        height={50}
        className="rounded"
      />
    </div>
  );
};

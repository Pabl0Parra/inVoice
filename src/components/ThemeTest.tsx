

export function ThemeTest() {
  return (
    <div className="p-8 space-y-4 border-2 border-red-500 m-4 rounded-lg">
      <h2 className="text-2xl font-bold text-red-600">Theme Verification</h2>
      
      <div className="space-y-2">
        <p className="font-bold">Font Test:</p>
        <p className="text-4xl font-sans">
          This should be Nunito (Rounder sans-serif)
        </p>
        <p className="text-4xl font-serif">
          This is Serif (Times New Roman usually)
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-bold">Color Test:</p>
        <div className="flex gap-4">
          <div className="p-4 bg-primary-dark-grey text-white rounded">
            bg-primary-dark-grey
          </div>
          <div className="p-4 bg-primary-grey text-white rounded">
            bg-primary-grey
          </div>
        </div>
      </div>
    </div>
  );
}

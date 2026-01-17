import React from 'react';

interface SliderControlsProps {
  sliders: { [key: string]: number };
  setSliders: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export const SliderControls: React.FC<SliderControlsProps> = ({ sliders, setSliders }) => {
  const sliderConfigs = [
    // Shape Appearance Controls
    { id: 'strokeWidth', label: 'Stroke Width', min: 1, max: 10, value: 2 },
    { id: 'color', label: 'Color Hue', min: 0, max: 360, value: 120, step: 1 },
    { id: 'colorCycling', label: 'Color Cycle Speed', min: 0, max: 5, value: 2, step: 0.1 },
    
    // Motion & Animation Controls
    { id: 'animationSpeed', label: 'Animation Speed', min: 0.5, max: 10, value: 2 },
    { id: 'rotationSpeed', label: 'Rotation Speed', min: -1, max: 1, value: 0.2, step: 0.01 },
    { id: 'autoRotation', label: 'Auto Rotation', min: 0, max: 4, value: 0, step: 0.01 },
    
    // Spawning & Origin Controls
    { id: 'spawnRate', label: 'Spawn Rate', min: 2, max: 10, value: 2, step: 0.1 },
    { id: 'originX', label: 'Origin X', min: 0, max: 100, value: 50 },
    { id: 'originY', label: 'Origin Y', min: 0, max: 100, value: 50 },
    { id: 'originXAutomation', label: 'Origin X Auto', min: 0, max: 2, value: 0.5, step: 0.01 },
    { id: 'originYAutomation', label: 'Origin Y Auto', min: 0, max: 2, value: 0, step: 0.01 }
  ];

  const handleSliderChange = (id: string, value: number) => {
    setSliders(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-black border-2 border-green-500 p-4 font-mono text-sm">
      <h2 className="text-green-500 text-lg font-bold mb-4 text-center">
        [ TUNNEL.CONTROLS v2.0 ]
      </h2>
      <div className="text-green-400 text-xs mb-4 text-center">
        &gt; ADJUST PARAMETERS.CFG
      </div>
      
      {/* Shape Appearance Controls */}
      <div className="mb-6 p-3 border border-green-600 bg-gray-800">
        <div className="text-green-400 text-sm font-bold mb-3 text-center">
          === SHAPE.APPEARANCE ===
        </div>
        
        {sliderConfigs.slice(0, 3).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-green-900 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <label className="text-green-400 text-xs">
                {String(index + 1).padStart(2, '0')}. {config.label.toUpperCase()}
              </label>
              <span className="text-green-500 text-xs font-bold">
                {sliders[config.id]?.toFixed(2) || config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] || config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: `linear-gradient(to right, #00ff92 0%, #00ff92 ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a 100%)`
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Motion & Animation Controls */}
      <div className="mb-6 p-3 border border-green-600 bg-gray-800">
        <div className="text-green-400 text-sm font-bold mb-3 text-center">
          === MOTION.CONTROLS ===
        </div>
        
        {sliderConfigs.slice(3, 6).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-green-900 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <label className="text-green-400 text-xs">
                {String(index + 4).padStart(2, '0')}. {config.label.toUpperCase()}
              </label>
              <span className="text-green-500 text-xs font-bold">
                {sliders[config.id]?.toFixed(2) || config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] || config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: `linear-gradient(to right, #00ff92 0%, #00ff92 ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a 100%)`
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Spawning & Origin Controls */}
      <div className="mb-6 p-3 border border-green-600 bg-gray-800">
        <div className="text-green-400 text-sm font-bold mb-3 text-center">
          === SPAWNING.ORIGIN.CONTROLS ===
        </div>
        
        {sliderConfigs.slice(6, 12).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-green-900 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <label className="text-green-400 text-xs">
                {String(index + 7).padStart(2, '0')}. {config.label.toUpperCase()}
              </label>
              <span className="text-green-500 text-xs font-bold">
                {sliders[config.id]?.toFixed(2) || config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] || config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: `linear-gradient(to right, #00ff92 0%, #00ff92 ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a ${((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 100}%, #1a1a1a 100%)`
              }}
            />
          </div>
        ))}
      </div>
      
      {/* System Status */}
      <div className="mt-6 p-2 border border-green-900 bg-gray-900">
        <div className="text-green-400 text-xs mb-2">SYSTEM STATUS</div>
        <div className="text-green-500 text-xs">[ONLINE] TUNNEL.ENGAGED</div>
        <div className="text-green-500 text-xs">[ACTIVE] PARAMETERS.LOADED</div>
        <div className="text-green-500 text-xs">[READY] RENDER.PIPELINE</div>
      </div>
    </div>
  );
};
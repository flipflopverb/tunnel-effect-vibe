import React from 'react';

interface SliderControlsProps {
  sliders: { [key: string]: number };
  setSliders: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  mouseFollow: boolean;
  setMouseFollow: React.Dispatch<React.SetStateAction<boolean>>;
  mouseRotationControl: boolean;
  setMouseRotationControl: React.Dispatch<React.SetStateAction<boolean>>;
  invertTextRotation: boolean;
  setInvertTextRotation: React.Dispatch<React.SetStateAction<boolean>>;
  colorPalette: string[];
  setColorPalette: React.Dispatch<React.SetStateAction<string[]>>;
  backgroundPalette: string[];
  setBackgroundPalette: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SliderControls: React.FC<SliderControlsProps> = ({ sliders, setSliders, mouseFollow, setMouseFollow, mouseRotationControl, setMouseRotationControl, invertTextRotation, setInvertTextRotation, colorPalette, setColorPalette, backgroundPalette, setBackgroundPalette }) => {
  const sliderConfigs = [
    // Shape Appearance Controls
    { id: 'animationSpeed', label: 'Animation Speed', min: 0.5, max: 5, value: 2 },
    { id: 'strokeWidth', label: 'Stroke Width', min: 1, max: 10, value: 2 },
    { id: 'colorCycling', label: 'Shape Color Cycle Speed', min: 0, max: 5, value: 2, step: 0.1 },
    
    // Motion & Animation Controls
    { id: 'rotationSpeed', label: 'Rotation Speed', min: -2, max: 2, value: 0.2, step: 0.01 },
    { id: 'autoRotation', label: 'Auto Rotation', min: 0, max: 8, value: 0, step: 0.01 },
    
    // Spawning & Origin Controls
    { id: 'spawnRate', label: 'Shape Spawn Rate', min: 0, max: 10, value: 5, step: 0.1 },
    { id: 'textSpawnRate', label: 'Text Spawn Rate', min: 0, max: 5, value: 0.1, step: 0.01 },
    { id: 'originX', label: 'Origin X', min: 0, max: 100, value: 50 },
    { id: 'originY', label: 'Origin Y', min: 0, max: 100, value: 50 },
    { id: 'originXAutomation', label: 'Origin X Auto', min: 0, max: 2, value: 0.5, step: 0.01 },
    { id: 'originYAutomation', label: 'Origin Y Auto', min: 0, max: 2, value: 0, step: 0.01 }
  ];

  const handleSliderChange = (id: string, value: number) => {
    setSliders(prev => ({ ...prev, [id]: value }));
  };

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...colorPalette];
    newPalette[index] = color;
    setColorPalette(newPalette);
  };

  const handleBackgroundColorChange = (index: number, color: string) => {
    const newPalette = [...backgroundPalette];
    newPalette[index] = color;
    setBackgroundPalette(newPalette);
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
      <div className="mb-6 p-3 border border-purple-300 bg-gray-800">
        <div className="text-purple-200 text-sm font-bold mb-3 text-center">
          === SHAPE.APPEARANCE ===
        </div>
        
        {sliderConfigs.slice(0, 3).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-purple-500 bg-gray-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-purple-100 text-xs">
                {config.label.toUpperCase()}
              </label>
              <span className="text-white text-xs font-bold">
                {sliders[config.id] !== undefined ? sliders[config.id].toFixed(2) : config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] !== undefined ? sliders[config.id] : config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: config.id === 'rotationSpeed' 
                  ? `linear-gradient(to right, #1a1a1a 0%, #1a1a1a ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a 100%)`
                  : (() => {
                      const currentValue = sliders[config.id] !== undefined ? sliders[config.id] : config.value;
                      const percentage = ((currentValue - config.min) / (config.max - config.min)) * 100;
                      console.log(`Slider ${config.id}: value=${currentValue}, min=${config.min}, max=${config.max}, percentage=${percentage}%`);
                      return `linear-gradient(to right, #ffffff 0%, #ffffff ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`;
                    })()
              }}
            />
          </div>
        ))}
        
        {/* Color Palette Picker */}
        <div className="mb-3 p-2 border border-purple-500 bg-gray-700">
          <div className="text-purple-100 text-xs mb-2">SHAPE COLOR PALETTE</div>
          <div className="grid grid-cols-2 gap-2">
            {colorPalette.map((color, index) => (
              <div key={index} className="flex items-center">
                <label className="text-purple-200 text-xs mr-2">{index + 1}:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-8 h-8 border border-purple-400 bg-gray-800 cursor-pointer"
                />
                <span className="text-purple-300 text-xs ml-1">{color}</span>
              </div>
            ))}
          </div>
        </div>
        
        
        {/* Background Color Cycle Speed */}
        <div className="mb-3 p-2 border border-purple-500 bg-gray-700">
          <div className="flex justify-between items-center mb-2">
            <label className="text-purple-100 text-xs">
              BG COLOR CYCLE SPEED
            </label>
            <span className="text-white text-xs font-bold">
              {sliders.backgroundCycling !== undefined ? sliders.backgroundCycling.toFixed(2) : '0.00'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={sliders.backgroundCycling !== undefined ? sliders.backgroundCycling : 0}
            onChange={(e) => handleSliderChange('backgroundCycling', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
            style={{
              background: (() => {
                const currentValue = sliders.backgroundCycling !== undefined ? sliders.backgroundCycling : 0;
                const percentage = ((currentValue - 0) / (5 - 0)) * 100;
                return `linear-gradient(to right, #ffffff 0%, #ffffff ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`;
              })()
            }}
          />
        </div>
        
        {/* Background Color Palette Picker */}
        <div className="mb-3 p-2 border border-purple-500 bg-gray-700">
          <div className="text-purple-100 text-xs mb-2">BACKGROUND COLOR PALETTE</div>
          <div className="grid grid-cols-2 gap-2">
            {backgroundPalette.map((color, index) => (
              <div key={index} className="flex items-center">
                <label className="text-purple-200 text-xs mr-2">{index + 1}:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleBackgroundColorChange(index, e.target.value)}
                  className="w-8 h-8 border border-purple-400 bg-gray-800 cursor-pointer"
                />
                <span className="text-purple-300 text-xs ml-1">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
       
      {/* Motion & Animation Controls */}
      <div className="mb-6 p-3 border border-cyan-300 bg-gray-800">
        <div className="text-cyan-200 text-sm font-bold mb-3 text-center">
          === MOTION.CONTROLS ===
        </div>
        
        {sliderConfigs.slice(3, 5).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-cyan-500 bg-gray-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-cyan-100 text-xs">
                {config.label.toUpperCase()}
              </label>
              <span className="text-white text-xs font-bold">
                {sliders[config.id] !== undefined ? sliders[config.id].toFixed(2) : config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] !== undefined ? sliders[config.id] : config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: config.id === 'rotationSpeed' 
                  ? `linear-gradient(to right, #1a1a1a 0%, #1a1a1a ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a 100%)`
                  : (() => {
                      const currentValue = sliders[config.id] !== undefined ? sliders[config.id] : config.value;
                      const percentage = ((currentValue - config.min) / (config.max - config.min)) * 100;
                      console.log(`Slider ${config.id}: value=${currentValue}, min=${config.min}, max=${config.max}, percentage=${percentage}%`);
                      return `linear-gradient(to right, #ffffff 0%, #ffffff ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`;
                    })()
              }}
            />
          </div>
        ))}
        
        {/* Invert Text Rotation Checkbox */}
        <div className="mb-3 p-2 border border-cyan-500 bg-gray-700">
          <label className="flex items-center text-cyan-100 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={invertTextRotation}
              onChange={(e) => setInvertTextRotation(e.target.checked)}
              className="mr-2 w-4 h-4 text-cyan-400 bg-gray-800 border-cyan-600 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span>INVERT TEXT ROTATION</span>
          </label>
        </div>
      </div>
       
      {/* Spawning & Origin Controls */}
      <div className="mb-6 p-3 border border-yellow-300 bg-gray-800">
        <div className="text-yellow-200 text-sm font-bold mb-3 text-center">
          === SPAWNING.ORIGIN.CONTROLS ===
        </div>
        
        {/* Mouse Follow Checkbox */}
        <div className="mb-3 p-2 border border-yellow-500 bg-gray-700">
          <label className="flex items-center text-yellow-100 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={mouseFollow}
              onChange={(e) => setMouseFollow(e.target.checked)}
              className="mr-2 w-4 h-4 text-yellow-400 bg-gray-800 border-yellow-600 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <span>ORIGIN FOLLOW MOUSE</span>
          </label>
        </div>
        
        {/* Mouse Rotation Control Checkbox */}
        <div className="mb-3 p-2 border border-yellow-500 bg-gray-700">
          <label className="flex items-center text-yellow-100 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={mouseRotationControl}
              onChange={(e) => setMouseRotationControl(e.target.checked)}
              className="mr-2 w-4 h-4 text-yellow-400 bg-gray-800 border-yellow-600 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <span>MOUSE ROTATION CONTROL</span>
          </label>
        </div>
        
        {sliderConfigs.slice(5, 11).map((config, index) => (
          <div key={config.id} className="mb-3 p-2 border border-yellow-500 bg-gray-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-yellow-100 text-xs">
                {config.label.toUpperCase()}
              </label>
              <span className="text-white text-xs font-bold">
                {sliders[config.id] !== undefined ? sliders[config.id].toFixed(2) : config.value.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 0.01}
              value={sliders[config.id] !== undefined ? sliders[config.id] : config.value}
              onChange={(e) => handleSliderChange(config.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 appearance-none cursor-pointer slider-terminal"
              style={{
                background: config.id === 'rotationSpeed' 
                  ? `linear-gradient(to right, #1a1a1a 0%, #1a1a1a ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 - ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #ffffff ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a ${50 + ((sliders[config.id] || config.value) - config.min) / (config.max - config.min) * 50}, #1a1a1a 100%)`
                  : (() => {
                      const currentValue = sliders[config.id] !== undefined ? sliders[config.id] : config.value;
                      const percentage = ((currentValue - config.min) / (config.max - config.min)) * 100;
                      console.log(`Slider ${config.id}: value=${currentValue}, min=${config.min}, max=${config.max}, percentage=${percentage}%`);
                      return `linear-gradient(to right, #ffffff 0%, #ffffff ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`;
                    })()
              }}
            />
          </div>
        ))}
      </div>
      
      {/* System Status */}
      <div className="mt-6 p-2 border border-purple-600 bg-gray-900">
        <div className="text-purple-400 text-xs mb-2">SYSTEM STATUS</div>
        <div className="text-purple-500 text-xs">[ONLINE] TUNNEL.ENGAGED</div>
        <div className="text-purple-500 text-xs">[ACTIVE] PARAMETERS.LOADED</div>
        <div className="text-purple-500 text-xs">[READY] RENDER.PIPELINE</div>
      </div>
    </div>
  );
};
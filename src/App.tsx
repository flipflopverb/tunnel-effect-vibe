import React, { useState, useEffect } from 'react';
import { TunnelEffect } from './TunnelEffect';
import { SliderControls } from './SliderControls';
import { ShapeSelector } from './ShapeSelector';

// Default slider values
const defaultSliders = {
  rotationSpeed: 0,
  animationSpeed: 2,
  strokeWidth: 2,
  originX: 50,
  originY: 50,
  spawnRate: 5,
  originXAutomation: 0,
  originYAutomation: 0,
  colorCycling: 0,
  backgroundCycling: 0,

  autoRotation: 0,
  textRotationSpeed: 0.2,
  textAutoRotation: 0,
  textSpawnRate: 0.1,
  textVisibleTime: 5,
  textFadeTime: 3,
  shapeTransparency: 255
};

// Static values
const staticConfig = {
  shapeCount: 200, // Static max of 200
  maxSize: null // Will be calculated as 110% of canvas
};

export function App() {
  const [sliders, setSliders] = useState(defaultSliders);
  const [shapeType, setShapeType] = useState<'triangle' | 'square' | 'circle'>('square');
  const [customText, setCustomText] = useState('');
  const [mouseFollow, setMouseFollow] = useState(false);
  const [mouseRotationControl, setMouseRotationControl] = useState(false);
  const [staticTextColor, setStaticTextColor] = useState(false);
  const [textColor, setTextColor] = useState('#00ff00');
  const [colorPalette, setColorPalette] = useState(['#00ff00', '#ff00ff', '#00ffff', '#ffff00']);
  const [backgroundPalette, setBackgroundPalette] = useState(['#000000', '#4a0066', '#661144', '#114444']);

  // Reset function to restore all defaults
  const handleReset = () => {
    setSliders(defaultSliders);
    setShapeType('square');
    setCustomText('');
    setMouseFollow(false);
    setMouseRotationControl(false);
    setInvertTextRotation(false);
    setStaticTextColor(false);
    setTextColor('#00ff00');
    setColorPalette(['#00ff00', '#ff00ff', '#00ffff', '#ffff00']);
    setBackgroundPalette(['#000000', '#4a0066', '#661144', '#114444']);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 terminal-pixel overflow-hidden">
      {/* Header */}
      <div className="bg-black border-b-2 border-green-500 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-400 mb-2">
            &gt; TUNNEL_EFFECT.SIMULATOR [v1.0]
          </h1>
          <div className="text-xs text-green-600 mb-2">
            CYBERPUNK TERMINAL INTERFACE | STATUS: ONLINE
          </div>
          <div className="text-xs text-green-500 font-mono">
            &gt; CURRENT.GEOMETRY: {(() => {
              const shapes = [
                { type: 'triangle', label: 'TRIANGLE' },
                { type: 'square', label: 'SQUARE' },
                { type: 'circle', label: 'CIRCLE' }
              ];
              return shapes.find(s => s.type === shapeType)?.label.toUpperCase() + '.ENGAGED';
            })()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Panel - Controls */}
        <div className="w-80 flex flex-col h-full">
          <div className="h-96 overflow-hidden">
            <ShapeSelector 
              shapeType={shapeType} 
              setShapeType={setShapeType} 
              customText={customText}
              setCustomText={setCustomText}
            />
          </div>
          <div className="flex-1 mt-4 overflow-hidden">
            <SliderControls sliders={sliders} setSliders={setSliders} mouseFollow={mouseFollow} setMouseFollow={setMouseFollow} mouseRotationControl={mouseRotationControl} setMouseRotationControl={setMouseRotationControl} staticTextColor={staticTextColor} setStaticTextColor={setStaticTextColor} textColor={textColor} setTextColor={setTextColor} colorPalette={colorPalette} setColorPalette={setColorPalette} backgroundPalette={backgroundPalette} setBackgroundPalette={setBackgroundPalette} onReset={handleReset} />
          </div>
        </div>

        {/* Right Panel - Canvas */}
        <div className="flex-1 relative bg-black border-l-2 border-green-500 min-h-0">
          <TunnelEffect 
            sliders={sliders} 
            shapeType={shapeType} 
            customText={customText}
            mouseFollow={mouseFollow}
            mouseRotationControl={mouseRotationControl}
            staticTextColor={staticTextColor}
            textColor={textColor}
            colorPalette={colorPalette}
            backgroundPalette={backgroundPalette}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black border-t-2 border-green-500 p-2 text-center text-xs text-green-600">
        &gt; INTERFACE.STABLE | PARAMETERS.APPLIED | RENDER.ACTIVE
      </div>
    </div>
  );
}

export default App;

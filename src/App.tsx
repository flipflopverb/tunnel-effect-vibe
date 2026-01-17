import React, { useState, useEffect } from 'react';
import { TunnelEffect } from './TunnelEffect';
import { SliderControls } from './SliderControls';
import { ShapeSelector } from './ShapeSelector';
import './index.css';

// Default slider values
const defaultSliders = {
  rotationSpeed: 0.20,
  animationSpeed: 2,
  strokeWidth: 2,
  originX: 50,
  originY: 50,
  spawnRate: 2,
  originXAutomation: 0.5,
  originYAutomation: 0,
  color: 120,
  colorCycling: 2,
  autoRotation: 0
};

// Static values
const staticConfig = {
  shapeCount: 100, // Static max of 100
  maxSize: null // Will be calculated as 110% of canvas
};

export function App() {
  const [sliders, setSliders] = useState(defaultSliders);
  const [shapeType, setShapeType] = useState<'triangle' | 'square' | 'circle' | 'hexagon'>('circle');

  return (
    <div className="min-h-screen bg-black text-green-500 terminal-pixel overflow-hidden">
      {/* Header */}
      <div className="bg-black border-b-2 border-green-500 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-400 mb-2">
            &gt; TUNNEL_EFFECT.SIMULATOR [v1.0]
          </h1>
          <div className="text-xs text-green-600">
            CYBERPUNK TERMINAL INTERFACE | STATUS: ONLINE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Panel - Controls */}
        <div className="w-80 flex flex-col h-full">
          <ShapeSelector shapeType={shapeType} setShapeType={setShapeType} />
          <div className="flex-1 mt-4 overflow-hidden">
            <SliderControls sliders={sliders} setSliders={setSliders} />
          </div>
        </div>

        {/* Right Panel - Canvas */}
        <div className="flex-1 relative bg-black border-l-2 border-green-500 min-h-0">
          <TunnelEffect sliders={sliders} shapeType={shapeType} />
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

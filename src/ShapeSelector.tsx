import React from 'react';

interface ShapeSelectorProps {
  shapeType: 'triangle' | 'square' | 'circle';
  setShapeType: React.Dispatch<React.SetStateAction<'triangle' | 'square' | 'circle'>>;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({ shapeType, setShapeType, customText, setCustomText }) => {
  const shapes = [
    { type: 'triangle', symbol: '▲', label: 'TRIANGLE' },
    { type: 'square', symbol: '■', label: 'SQUARE' },
    { type: 'circle', symbol: '●', label: 'CIRCLE' }
  ];

  return (
    <div className="bg-black border-2 border-green-500 p-4 font-mono text-sm terminal-pixel">
      <h3 className="text-green-500 text-lg font-bold mb-4 text-center">
        [ SHAPE.SELECTOR ]
      </h3>
      
      <div className="space-y-2">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            onClick={() => setShapeType(shape.type)}
            className={`w-full p-3 border font-bold text-xs transition-all duration-200 ${
              shapeType === shape.type
                ? 'bg-green-900 border-green-400 text-green-300'
                : 'bg-gray-900 border-green-900 text-green-500 hover:bg-green-950 hover:border-green-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{shape.symbol}</span>
              <span>[{shape.label}]</span>
              <span>{shapeType === shape.type ? 'ACTIVE' : 'READY'}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Custom Text Input */}
      <div className="mt-4 p-3 border border-green-600 bg-gray-800">
        <div className="text-green-400 text-xs mb-2">CUSTOM TEXT SPAWNER</div>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value.slice(0, 16))}
          placeholder="Enter text (16 chars max)"
          maxLength={16}
          className="w-full px-2 py-1 bg-gray-900 border border-green-700 text-green-400 text-xs font-mono focus:outline-none focus:border-green-500"
        />
        <div className="text-green-600 text-xs mt-1">
          [{customText.length}/16] - Adjustable spawn rate
        </div>
      </div>
      
      <div className="mt-4 p-2 border border-green-900 bg-gray-900">
        <div className="text-green-400 text-xs mb-2">CURRENT GEOMETRY</div>
        <div className="text-green-500 text-xs font-bold">
          &gt; {shapes.find(s => s.type === shapeType)?.label.toUpperCase()}.ENGAGED
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useRef } from 'react';
import p5Types from 'p5';

interface TunnelEffectProps {
  sliders: { [key: string]: number };
  shapeType: 'triangle' | 'square' | 'circle' | 'hexagon';
}

export const TunnelEffect: React.FC<TunnelEffectProps> = ({ sliders, shapeType }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5Types) => {
      let tunnel: Shape[] = [];
      let lastSpawnTime = 0;
      
      interface Shape {
        x: number;
        y: number;
        originX: number;
        originY: number;
        size: number;
        rotation: number;
        speed: number;
        growthRate: number;
        growthAcceleration: number;
        accelerationMultiplier: number;
        maxSize: number;
        spawnTime: number; // Track when shape was spawned
        currentHue: number; // Track individual color cycling
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth - 320, p.windowHeight - 120);
        canvas.parent(canvasRef.current!);
        initializeTunnel();
      };

      const initializeTunnel = () => {
        tunnel = [];
        lastSpawnTime = p.millis();
      };

      const spawnShape = () => {
        const canvasDiagonal = Math.sqrt(p.width * p.width + p.height * p.height);
        const actualMaxSize = canvasDiagonal * 4.0; // 400% of canvas diagonal
        
        // Calculate automated origin values
        const automatedOriginX = sliders.originXAutomation > 0 ? 
          sliders.originX + Math.sin(p.frameCount * 0.05 * sliders.originXAutomation) * 30 :
          sliders.originX;
        const automatedOriginY = sliders.originYAutomation > 0 ?
          sliders.originY + Math.cos(p.frameCount * 0.05 * sliders.originYAutomation) * 30 :
          sliders.originY;
        
        const spawnX = (automatedOriginX / 100) * p.width;
        const spawnY = (automatedOriginY / 100) * p.height;
        
        tunnel.push({
          x: spawnX, // Start at automated X position
          y: spawnY, // Start at automated Y position
          originX: (sliders.originX / 100) * p.width, // Store base origin
          originY: (sliders.originY / 100) * p.height, // Store base origin
          size: 1, // All shapes start tiny
          rotation: 0,
          speed: sliders.animationSpeed,
          growthRate: 1.0,
          growthAcceleration: 0.001,
          accelerationMultiplier: 1.0,
          maxSize: actualMaxSize,
          spawnTime: p.millis(),
          currentHue: sliders.color // Start at base color hue
        });
      };

      p.draw = () => {
        // Clean dark background
        p.background(5, 8, 12);
        
        // Spawn new shapes at adjustable rate (max 100)
        const spawnInterval = 1000 / sliders.spawnRate; // Convert rate to milliseconds
        if (tunnel.length < 100 && p.millis() - lastSpawnTime > spawnInterval) {
          spawnShape();
          lastSpawnTime = p.millis();
        }
        
        // Update and filter shapes (remove oversized ones)
        tunnel = tunnel.filter(shape => {
          // Update shape with compound acceleration
          shape.accelerationMultiplier += 0.001; // Acceleration itself accelerates
          const compoundAcceleration = shape.growthAcceleration * shape.accelerationMultiplier * 2; // 2x scaling
          const sizeFactor = Math.max(0.1, 1 + (shape.size * compoundAcceleration));
          const growthRate = shape.speed * shape.growthRate * sizeFactor;
          shape.size += growthRate;
          // Auto-adjust rotation speed with extreme changes
          const targetRotationSpeed = Math.sin(p.frameCount * 0.01) * sliders.autoRotation; // Moderate oscillation
          const rotationSpeedDiff = targetRotationSpeed - sliders.rotationSpeed;
          const adjustedRotationSpeed = sliders.rotationSpeed + rotationSpeedDiff * 0.6; // Extreme blending
          shape.rotation += adjustedRotationSpeed * 0.01;
          
          // Update color cycling
          shape.currentHue = (shape.currentHue + sliders.colorCycling) % 360;
          
          // Ultra-slow recentering - shapes must grow 12x larger before significant centering
          const centerX = p.width / 2;
          const centerY = p.height / 2;
          const ultraSlowCentering = 1 - Math.exp(-shape.size * 0.0001); // 12x slower than before
          shape.x = shape.x + (centerX - shape.x) * ultraSlowCentering;
          shape.y = shape.y + (centerY - shape.y) * ultraSlowCentering;
          
          // Delete shape if it gets too big
          return shape.size <= shape.maxSize;
        });
        
        // Draw remaining shapes
        tunnel.forEach((shape, index) => {
          const depth = index / tunnel.length;
          
          // Calculate alpha based on depth
          const fadeFactor = 1 - (depth * 0.5); // Fixed fade distance
          const alpha = Math.max(0, Math.min(255, 255 * fadeFactor));
          
          // Dynamic color with individual cycling per shape
          const hue = Math.floor(shape.currentHue);
          const color = p.color(`hsl(${hue}, 100%, 50%)`);
          p.stroke(p.red(color), p.green(color), p.blue(color), alpha);
          p.strokeWeight(sliders.strokeWidth);
          p.noFill();
          
          p.push();
          p.translate(shape.x, shape.y);
          p.rotate(shape.rotation);
          
          // Current size (no pulse effect)
          let currentSize = shape.size;
          
          // Draw shape based on type
          switch (shapeType) {
            case 'circle':
              p.ellipse(0, 0, currentSize, currentSize);
              break;
              
            case 'square':
              p.rectMode(p.CENTER);
              p.rect(0, 0, currentSize, currentSize);
              break;
              
            case 'triangle':
              const height = currentSize * 0.866;
              p.triangle(
                0, -height / 2,
                -currentSize / 2, height / 2,
                currentSize / 2, height / 2
              );
              break;
              
            case 'circle':
              p.ellipse(0, 0, currentSize, currentSize);
              break;
          }
          
          p.pop();
          p.drawingContext.shadowBlur = 0;
        });
      };

      p.windowResized = () => {
        // Calculate new canvas size based on window
        const newWidth = Math.max(400, window.innerWidth - 320); // Account for left panel width
        const newHeight = Math.max(400, window.innerHeight - 120); // Account for header/footer
        
        p.resizeCanvas(newWidth, newHeight);
      };
    };

    const p5Instance = new p5Types(sketch);
    
    return () => {
      p5Instance.remove();
    };
  }, [sliders, shapeType]);

  return <div ref={canvasRef} className="w-full h-full" />;
};
import React, { useEffect, useRef } from 'react';
import p5Types from 'p5';

interface TunnelEffectProps {
  sliders: { [key: string]: number };
  shapeType: 'triangle' | 'square' | 'circle';
  customText: string;
  mouseFollow: boolean;
  mouseRotationControl: boolean;
  invertTextRotation: boolean;
  staticTextColor: boolean;
  textColor: string;
  colorPalette: string[];
  backgroundPalette: string[];
}

export const TunnelEffect: React.FC<TunnelEffectProps> = ({ sliders, shapeType, customText, mouseFollow, mouseRotationControl, invertTextRotation, staticTextColor, textColor, colorPalette, backgroundPalette }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Store parameters in refs to always have latest values
  const slidersRef = useRef(sliders);
  const shapeTypeRef = useRef(shapeType);
  const customTextRef = useRef(customText);
  const mouseFollowRef = useRef(mouseFollow);
  const mouseRotationControlRef = useRef(mouseRotationControl);
  const invertTextRotationRef = useRef(invertTextRotation);
  const staticTextColorRef = useRef(staticTextColor);
  const textColorRef = useRef(textColor);
  const colorPaletteRef = useRef(colorPalette);
  const backgroundPaletteRef = useRef(backgroundPalette);
  
  // Update refs when props change
  useEffect(() => {
    slidersRef.current = sliders;
    shapeTypeRef.current = shapeType;
    customTextRef.current = customText;
    mouseFollowRef.current = mouseFollow;
    mouseRotationControlRef.current = mouseRotationControl;
    invertTextRotationRef.current = invertTextRotation;
    staticTextColorRef.current = staticTextColor;
    textColorRef.current = textColor;
    colorPaletteRef.current = colorPalette;
    backgroundPaletteRef.current = backgroundPalette;
  }, [sliders, shapeType, customText, mouseFollow, mouseRotationControl, invertTextRotation, staticTextColor, textColor, colorPalette, backgroundPalette]);

  useEffect(() => {
    if (!canvasRef.current) return;

      const sketch = (p: p5Types) => {
      let tunnel: Shape[] = [];
      let lastSpawnTime = 0;
      let lastTextSpawnTime = 0;
      let globalColorIndex = 0; // Track which color to use for new spawns
      let backgroundCycleTime = 0; // Track background color cycling
      
      // Helper function to interpolate between colors smoothly
      const interpolateColor = (colorOffset: number, palette: string[], time: number, cycleSpeed: number) => {
        const paletteLength = palette.length;
        if (paletteLength === 0) return p.color(0, 255, 0); // Default green if no colors
        
        let animatedOffset;
        if (cycleSpeed === 0) {
          // When cycling is disabled, use only the initial color offset without time animation
          animatedOffset = colorOffset % paletteLength;
        } else {
          // Add time-based animation for continuous smooth transitions when cycling is enabled
          animatedOffset = (colorOffset + time * 0.0001) % paletteLength;
        }
        
        const index1 = Math.floor(animatedOffset) % paletteLength;
        const index2 = (index1 + 1) % paletteLength;
        const t = animatedOffset - Math.floor(animatedOffset); // Fractional part
        
        const color1 = p.color(palette[index1]);
        const color2 = p.color(palette[index2]);
        
        return p.lerpColor(color1, color2, t);
      };
      
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
        colorOffset: number; // Continuous color offset for smooth transitions
        text?: string; // Optional text content
        isText?: boolean; // Flag to identify text shapes
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth - 320, p.windowHeight - 120);
        canvas.parent(canvasRef.current!);
      };

      const spawnShape = (customX?: number, customY?: number) => {
        const drawSliders = slidersRef.current;
        const canvasDiagonal = Math.sqrt(p.width * p.width + p.height * p.height);
        const actualMaxSize = canvasDiagonal * 4.0; // 400% of canvas diagonal
        
        let spawnX: number;
        let spawnY: number;
        
        if (customX !== undefined && customY !== undefined) {
          // Use mouse position when provided
          spawnX = customX;
          spawnY = customY;
        } else if (mouseFollowRef.current) {
          // If mouse follow is enabled but no custom position, use current mouse position
          spawnX = p.mouseX;
          spawnY = p.mouseY;
        } else {
          // Use automated origin values
          const automatedOriginX = drawSliders.originXAutomation > 0 ? 
            drawSliders.originX + Math.sin(p.frameCount * 0.05 * drawSliders.originXAutomation) * 30 :
            drawSliders.originX;
          const automatedOriginY = drawSliders.originYAutomation > 0 ?
            drawSliders.originY + Math.cos(p.frameCount * 0.05 * drawSliders.originYAutomation) * 30 :
            drawSliders.originY;
          
          spawnX = (automatedOriginX / 100) * p.width;
          spawnY = (automatedOriginY / 100) * p.height;
        }
        
        tunnel.push({
          x: spawnX,
          y: spawnY,
          originX: (drawSliders.originX / 100) * p.width,
          originY: (drawSliders.originY / 100) * p.height,
          size: 1, // All shapes start tiny
          rotation: 0,
          speed: drawSliders.animationSpeed,
          growthRate: 1.0,
          growthAcceleration: 0.001,
          accelerationMultiplier: 1.0,
          maxSize: actualMaxSize,
          spawnTime: p.millis(),
          colorOffset: globalColorIndex // Use current global color offset
        });
      };

      const spawnText = (customX?: number, customY?: number) => {
        const drawSliders = slidersRef.current;
        const drawCustomText = customTextRef.current;
        
        if (!drawCustomText.trim()) return; // Don't spawn if text is empty
        
        const canvasDiagonal = Math.sqrt(p.width * p.width + p.height * p.height);
        const canvasSize = Math.max(p.width, p.height);
        const actualMaxSize = canvasSize * 8.0; // Text grows to 800% of canvas size (8x) - optimized for performance
        
        let spawnX: number;
        let spawnY: number;
        
        if (customX !== undefined && customY !== undefined) {
          // Use mouse position when provided
          spawnX = customX;
          spawnY = customY;
        } else if (mouseFollowRef.current) {
          // If mouse follow is enabled but no custom position, use current mouse position
          spawnX = p.mouseX;
          spawnY = p.mouseY;
        } else {
          // Use automated origin values
          const automatedOriginX = drawSliders.originXAutomation > 0 ? 
            drawSliders.originX + Math.sin(p.frameCount * 0.05 * drawSliders.originXAutomation) * 30 :
            drawSliders.originX;
          const automatedOriginY = drawSliders.originYAutomation > 0 ?
            drawSliders.originY + Math.cos(p.frameCount * 0.05 * drawSliders.originYAutomation) * 30 :
            drawSliders.originY;
          
          spawnX = (automatedOriginX / 100) * p.width;
          spawnY = (automatedOriginY / 100) * p.height;
        }
        
        tunnel.push({
          x: spawnX,
          y: spawnY,
          originX: (drawSliders.originX / 100) * p.width,
          originY: (drawSliders.originY / 100) * p.height,
          size: 1, // Start tiny
          rotation: 0,
          speed: drawSliders.animationSpeed,
          growthRate: 1.0,
          growthAcceleration: 0.001,
          accelerationMultiplier: 1.0,
          maxSize: actualMaxSize,
          spawnTime: p.millis(),
          colorOffset: globalColorIndex, // Use current global color offset
          text: drawCustomText,
          isText: true
        });
      };

      p.draw = () => {
        const drawSliders = slidersRef.current;
        const drawCustomText = customTextRef.current;
        
        // Dynamic background using palette with smooth transitions
        if (drawSliders.backgroundCycling > 0) {
          backgroundCycleTime += drawSliders.backgroundCycling * 0.001;
        }
        
        const bgAnimatedOffset = (backgroundCycleTime) % backgroundPaletteRef.current.length;
        const bgIndex1 = Math.floor(bgAnimatedOffset) % backgroundPaletteRef.current.length;
        const bgIndex2 = (bgIndex1 + 1) % backgroundPaletteRef.current.length;
        const bgT = bgAnimatedOffset - Math.floor(bgAnimatedOffset); // Fractional part
        
        const bgColor1 = p.color(backgroundPaletteRef.current[bgIndex1]);
        const bgColor2 = p.color(backgroundPaletteRef.current[bgIndex2]);
        const bgColor = p.lerpColor(bgColor1, bgColor2, bgT);
        
        p.background(bgColor);
        
        // Hide cursor when mouse is over canvas and follow mode or mouse rotation control is enabled
        if ((mouseFollowRef.current || mouseRotationControlRef.current) && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          document.body.style.cursor = 'none';
        } else {
          document.body.style.cursor = 'auto';
        }
        
        // Spawn new shapes at adjustable rate (max 200)
        if (drawSliders.spawnRate > 0) {
          const spawnInterval = 1000 / drawSliders.spawnRate; // Convert rate to milliseconds
          if (tunnel.length < 200 && p.millis() - lastSpawnTime > spawnInterval) {
            const mouseFollowEnabled = mouseFollowRef.current;
            if (mouseFollowEnabled) {
              spawnShape(p.mouseX, p.mouseY);
            } else {
              spawnShape();
            }
            lastSpawnTime = p.millis();
          }
        }
        
        // Spawn custom text at adjustable rate
        if (drawCustomText.trim() && drawSliders.textSpawnRate > 0) {
          const textSpawnInterval = 1000 / drawSliders.textSpawnRate; // Convert rate to milliseconds
          if (tunnel.length < 200 && p.millis() - lastTextSpawnTime > textSpawnInterval) {
            console.log('Spawning text:', drawCustomText, 'Rate:', drawSliders.textSpawnRate);
            const mouseFollowEnabled = mouseFollowRef.current;
            if (mouseFollowEnabled) {
              spawnText(p.mouseX, p.mouseY);
            } else {
              spawnText();
            }
            lastTextSpawnTime = p.millis();
          }
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
          let adjustedRotationSpeed;
          if (mouseRotationControlRef.current) {
            // Mouse-controlled rotation: left = negative, right = positive
            const normalizedMouseX = (p.mouseX - p.width / 2) / (p.width / 2); // -1 to 1
            adjustedRotationSpeed = normalizedMouseX * 2; // Scale to reasonable range
          } else {
            const targetRotationSpeed = Math.sin(p.frameCount * 0.01) * drawSliders.autoRotation; // Moderate oscillation
            const rotationSpeedDiff = targetRotationSpeed - drawSliders.rotationSpeed;
            adjustedRotationSpeed = drawSliders.rotationSpeed + rotationSpeedDiff * 0.6; // Extreme blending
          }
          
          // Invert rotation for text if enabled
          const rotationSpeed = shape.isText && invertTextRotationRef.current ? -adjustedRotationSpeed : adjustedRotationSpeed;
          shape.rotation += rotationSpeed * 0.01;
          
          // Moderate recentering - shapes gradually move toward center
          const centerX = p.width / 2;
          const centerY = p.height / 2;
          const moderateCentering = 1 - Math.exp(-shape.size * 0.00006); // Slightly faster centering
          shape.x = shape.x + (centerX - shape.x) * moderateCentering;
          shape.y = shape.y + (centerY - shape.y) * moderateCentering;
          
          // Delete shape if it gets too big, but allow text to stay long enough to fade
          if (shape.isText && shape.text) {
            const age = p.millis() - shape.spawnTime;
            // Keep text for at least 8 seconds (5 seconds + 3 second fade)
            return shape.size <= shape.maxSize && age <= 8000;
          }
          return shape.size <= shape.maxSize;
        });
        

        
        // Update global color offset for new spawns based on cycle speed
        if (drawSliders.colorCycling > 0) {
          globalColorIndex += drawSliders.colorCycling * 0.01;
        }
        
        // Reset global color index to 0 when cycling is disabled to keep colors static
        if (drawSliders.colorCycling === 0) {
          globalColorIndex = 0;
        }
        
        // Draw remaining shapes
        tunnel.forEach((shape, index) => {
          // Calculate fade for text after 5 seconds
          let alpha = 255;
          if (shape.isText && shape.text) {
            const age = p.millis() - shape.spawnTime;
            if (age > 5000) {
              alpha = Math.max(0, 255 - ((age - 5000) / 3000) * 255); // Fade over 3 seconds after 5 seconds
            }
          }
          
          // Smooth color interpolation (static for text if checkbox is checked)
          let color;
          if (shape.isText && shape.text && staticTextColorRef.current) {
            // Use the dedicated text color for static text
            color = p.color(textColorRef.current);
          } else {
            color = interpolateColor(shape.colorOffset, colorPaletteRef.current, shape.spawnTime, drawSliders.colorCycling);
          }
          p.stroke(p.red(color), p.green(color), p.blue(color), alpha);
          p.strokeWeight(drawSliders.strokeWidth);
          
          p.noFill();
          
          p.push();
          p.translate(shape.x, shape.y);
          p.rotate(shape.rotation);
          
          // Draw shape based on type or text
          if (shape.isText && shape.text) {
            // Draw text with growth and performance optimization
            p.textAlign(p.CENTER, p.CENTER);
            const textSize = shape.size / 6; // Smaller scaling for better performance
            p.textSize(textSize);
            p.textFont('monospace');
            
            // Skip rendering if text is too large (performance optimization)
            if (textSize < 500) { // Only render if text is under 500px
              p.text(shape.text, 0, 0);
            }
          } else {
            // Draw regular shapes
            switch (shapeTypeRef.current) {
              case 'circle':
                p.ellipse(0, 0, shape.size, shape.size);
                break;
                
              case 'square':
                p.rectMode(p.CENTER);
                p.rect(0, 0, shape.size, shape.size);
                break;
                
              case 'triangle':
                const height = shape.size * 0.866;
                p.triangle(
                  0, -height / 2,
                  -shape.size / 2, height / 2,
                  shape.size / 2, height / 2
                );
                break;
            }
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
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []); // Only create p5 instance once

  // Separate effect for parameter updates
  useEffect(() => {
    // Send parameter updates to existing p5 instance
    // This will be handled in the sketch by accessing latest slider values
  }, [sliders, shapeType, customText, mouseFollow]);

  return <div ref={canvasRef} className="w-full h-full" />;
};
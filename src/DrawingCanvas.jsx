import React, { useRef, useState, useEffect } from 'react';
import './DrawingCanvas.css';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [brushSize, setBrushSize] = useState(5); // Define brush size state
  const [socket] = useState(new WebSocket('wss://yourserver.com'));
  const [showCanvas, setShowCanvas] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    setLastPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = colorPickerRef.current.value;
    ctx.lineWidth = brushSize; // Use brush size state
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    setLastPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    sendCanvasToServer();
  };

  const sendCanvasToServer = () => {
    const canvas = canvasRef.current;
    const canvasData = canvas.toDataURL();
    socket.send(JSON.stringify({ canvas: canvasData }));
  };

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.canvas) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = data.canvas;
        img.onload = () => ctx.drawImage(img, 0, 0);
      }
    };

    return () => {
      socket.close(); // Clean up on unmount
    };
  }, [socket]);

  return (
    <div className="container">
      <h1 className="heading"></h1>
      {!showCanvas ? (
        <button className="start-button" onClick={() => setShowCanvas(true)}>
          Start Drawing
        </button>
      ) : (
        <div className="canvas-container">
          <input type="color" ref={colorPickerRef} defaultValue="#000000" className="color-picker" />
          <label className="brush-size-label"> {/* Corrected classname */}
            Brush Size:
            <input 
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              className="brush-size-slider"
            />
          </label>
          <canvas
            ref={canvasRef}
            width="700"
            height="700"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={() => setIsDrawing(false)}
            className="canvas"
          />
        </div>
      )}
    </div>
  );
}

export default DrawingCanvas;

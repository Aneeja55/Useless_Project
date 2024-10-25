import React, { useRef, useState, useEffect } from 'react';
import './DrawingCanvas.css';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [brushSize, setBrushSize] = useState(5);
  const [socket] = useState(new WebSocket('wss://yourserver.com'));
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasName, setCanvasName] = useState('');

  const startDrawing = (e) => {
    setIsDrawing(true);
    setLastPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = colorPickerRef.current.value;
    ctx.lineWidth = brushSize;
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

  const saveCanvasToLocal = () => {
    const canvas = canvasRef.current;
    const canvasData = canvas.toDataURL();
    const existingCanvases = JSON.parse(localStorage.getItem('canvases')) || [];
    existingCanvases.push({ name: canvasName, data: canvasData });
    localStorage.setItem('canvases', JSON.stringify(existingCanvases));
    setCanvasName(''); // Clear the input after saving
  };

  const loadRandomCanvas = () => {
    const existingCanvases = JSON.parse(localStorage.getItem('canvases')) || [];
    if (existingCanvases.length > 0) {
      const randomIndex = Math.floor(Math.random() * existingCanvases.length);
      const canvasData = existingCanvases[randomIndex].data;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing canvas
      const img = new Image();
      img.src = canvasData;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
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
      <h1 className="heading">
        CANUDRO<span className="blink">??</span>
      </h1>
      {!showCanvas ? (
        <button className="start-button" onClick={() => setShowCanvas(true)}>
          Start Drawing
        </button>
      ) : (
        <div className="canvas-container">
<<<<<<< HEAD
          <input type="color" ref={colorPickerRef} defaultValue="#000000" className="color-picker" />
          <label className="brush-size-label">
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
=======
>>>>>>> 0bc815b0981352a3b0288b8a066900a8e540f89f
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
<<<<<<< HEAD
          <div className="button-container">
            <button onClick={saveCanvasToLocal} className="save-local-button">Save Canvas</button>
            <button onClick={loadRandomCanvas} className="load-random-button">Load Random Canvas</button>
            <input 
              type="text" 
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)} 
              placeholder="Enter canvas name"
              className="canvas-name-input"
            />
=======
          <div className="controls">
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
>>>>>>> 0bc815b0981352a3b0288b8a066900a8e540f89f
          </div>
        </div>
      )}
    </div>
  );
}

export default DrawingCanvas;

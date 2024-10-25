import React, { useRef, useState, useEffect } from 'react';

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [socket] = useState(new WebSocket('ws://yourserver.com'));

  // Drawing function
  const startDrawing = (e) => {
    setIsDrawing(true);
    setLastPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = colorPickerRef.current.value;
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
  }, [socket]);

  return (
    <div>
      <input type="color" ref={colorPickerRef} defaultValue="#000000" />
      <canvas
        ref={canvasRef}
        width="500"
        height="500"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={() => setIsDrawing(false)}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
}
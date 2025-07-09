import React, { useEffect, useState } from 'react';

function DrawingCanvas({ canvasRef, drawColor, mode, image, imgPos, setImgPos, imgSize, setImgSize }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isResizingImage, setIsResizingImage] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const handleSize = 15;

  const draw = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
    setLastPos({ x, y });
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (image) {
      ctx.drawImage(image, imgPos.x, imgPos.y, imgSize.width, imgSize.height);
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        imgPos.x + imgSize.width - handleSize,
        imgPos.y + imgSize.height - handleSize,
        handleSize,
        handleSize
      );
    }
  };

  useEffect(() => {
    redraw();
  }, [image, imgPos, imgSize]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'resize' && x >= imgPos.x + imgSize.width - handleSize && x <= imgPos.x + imgSize.width &&
      y >= imgPos.y + imgSize.height - handleSize && y <= imgPos.y + imgSize.height) {
      setIsResizingImage(true);
      setResizeStartPos({ x, y });
      setStartSize({ ...imgSize });
      return;
    }

    if (mode === 'move' && image && x >= imgPos.x && x <= imgPos.x + imgSize.width &&
      y >= imgPos.y && y <= imgPos.y + imgSize.height) {
      setIsDraggingImage(true);
      setDragOffset({ x: x - imgPos.x, y: y - imgPos.y });
      return;
    }

    if (mode === 'draw') {
      setIsDrawing(true);
      setLastPos({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing) {
      draw(x, y);
      return;
    }

    if (isDraggingImage) {
      setImgPos({ x: x - dragOffset.x, y: y - dragOffset.y });
      return;
    }

    if (isResizingImage) {
      setImgSize({
        width: Math.max(20, startSize.width + (x - resizeStartPos.x)),
        height: Math.max(20, startSize.height + (y - resizeStartPos.y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDraggingImage(false);
    setIsResizingImage(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        border: '1px solid black',
        touchAction: 'none',
      }}
    />
  );
}

export default DrawingCanvas;
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './styles/canvas.css';

const Canvas = ({ selectedTool }) => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedRectangleId, setSelectedRectangleId] = useState(null);

  // Add rectangle to canvas
  const handleCanvasClick = (e) => {
    if (selectedTool === 'rectangle') {
      const newRectangle = {
        id: rectangles.length + 1,
        x: e.clientX - 50,
        y: e.clientY - 25,
        width: 100,
        height: 50,
      };
      setRectangles([...rectangles, newRectangle]);
    }
  };

  // Delete selected rectangle
  const handleDelete = (id) => {
    setRectangles(rectangles.filter(rect => rect.id !== id));
  };

  return (
    <div
      className="canvas"
      onClick={handleCanvasClick}
      onKeyDown={(e) => {
        if (e.key === 'Delete' && selectedRectangleId) {
          handleDelete(selectedRectangleId);
          setSelectedRectangleId(null);
        }
      }}
      tabIndex="0"
    >
      {rectangles.map((rect) => (
        <Rnd
          key={rect.id}
          className={`rectangle ${selectedRectangleId === rect.id ? 'selected' : ''}`}
          default={{
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          }}
          bounds="parent"
          onClick={() => setSelectedRectangleId(rect.id)}
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
        />
      ))}
    </div>
  );
};

export default Canvas;
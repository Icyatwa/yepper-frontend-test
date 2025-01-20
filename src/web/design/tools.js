// tools.js
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './styles/tools.css';

export const Rectangle = ({ element, isSelected, onClick, onContextMenu, onDoubleClick }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    function truncateInstructions(instructions) {
        if (!instructions) return '';
        const words = instructions.split(' ');
        return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : instructions;
    }
      
    return (
        <Rnd
            className={`rectangle ${isSelected ? 'selected' : ''}`}
            default={{
                x: element.startX,
                y: element.startY,
                width: element.width || 150,
                height: element.height || 100,
            }}
            bounds="parent"
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
            onClick={onClick}
            onDoubleClick={onDoubleClick} // Handle double-click to open the form
            onContextMenu={onContextMenu}
            onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
            onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
            dragHandleClassName="rectangle"
            disableDragging={false}
            onDragStop={(e, d) => {
                element.startX = d.x;
                element.startY = d.y;
            }}
            >
            <div className="rectangle-content">
                {/* Display the amount with currency */}
                <div>{element.content}</div>
                {element.availability && (
                    <div className="availability-display">{element.availability}</div>
                )}
                <div className="instructions-preview">
                    {/* Display truncated instructions */}
                    {truncateInstructions(element.instructions)}
                </div>
            </div>

            {showTooltip && (
                <div className="tooltip">
                Double click to choose
                </div>
            )}
        </Rnd>

    );
};
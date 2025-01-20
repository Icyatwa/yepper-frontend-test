// Design.js
import React, { useState, useRef } from 'react';
import './styles/design.css';
import Header from './header';
import { Rectangle } from './tools';
import Inputs from './inputs';

const Design = () => {
    const [tool, setTool] = useState('cursor');
    const containerRef = useRef(null);
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [formVisible, setFormVisible] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleMouseDown = (e) => {
        if (tool === 'cursor') return;

        const container = containerRef.current.getBoundingClientRect();
        const startX = e.clientX - container.left;
        const startY = e.clientY - container.top;

        let newElement = null;

        if (tool === 'rectangle') {
            newElement = { type: 'rectangle', startX, startY, width: 0, height: 0, id: Date.now() };
        }

        if (newElement) {
            setElements([...elements, newElement]);
            setTool('cursor');
        }

        const handleMouseMove = (e) => {
            if (!newElement) return;
            const currentX = e.clientX - container.left;
            const currentY = e.clientY - container.top;
            const width = currentX - startX;
            const height = currentY - startY;

            setElements((prevElements) => {
                const updatedElements = [...prevElements];
                updatedElements[updatedElements.length - 1] = {
                    ...newElement,
                    width: Math.abs(width),
                    height: Math.abs(height),
                    startX: width < 0 ? currentX : startX,
                    startY: height < 0 ? currentY : startY,
                };
                return updatedElements;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleElementClick = (id) => {
        setSelectedElement(id);
    };

    const handleDoubleClick = (id) => {
        setSelectedElement(id);
        handleChoose(); // Simulate choosing the element (open form)
    };

    const handleKeyDown = (e) => {
        // Only delete if no input is focused
        if (e.key === 'Backspace' && selectedElement !== null && !isInputFocused) {
            setElements((prevElements) => prevElements.filter((el) => el.id !== selectedElement));
            setSelectedElement(null); // Deselect after deletion
        }
    };

    const handleRightClick = (e, id) => {
        e.preventDefault();
        setSelectedElement(id);

        const container = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        let contextMenuY = e.clientY;
        const contextMenuHeight = 100;

        if (contextMenuY + contextMenuHeight > viewportHeight) {
            contextMenuY = e.clientY - contextMenuHeight;
        }
    
        setContextMenu({ visible: true, x: e.clientX, y: contextMenuY });
    };

    const handleDelete = () => {
        setElements((prevElements) => prevElements.filter((el) => el.id !== selectedElement));
        setContextMenu({ visible: false });
        setFormVisible(false);
    };

    const handleChoose = () => {
        setContextMenu({ visible: false });
        const selectedEl = elements.find(el => el.id === selectedElement);
        if (selectedEl) {
            adjustFormPosition(selectedEl);
        }
        setFormVisible(true);
    };

    const adjustFormPosition = (element) => {
        const container = containerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const formMaxWidth = 400;
        const formMaxHeight = 300;
        const offset = 10;

        let formX = element.startX + element.width + offset;
        let formY = element.startY;

        if (formX + formMaxWidth > viewportWidth) {
            formX = element.startX - formMaxWidth - offset;
        }

        if (formY + formMaxHeight > viewportHeight) {
            formY = element.startY - formMaxHeight - offset;
        }

        if (formY < 0) {
            formY = offset;
        }

        if (formY + formMaxHeight > viewportHeight) {
            formY = viewportHeight - formMaxHeight - offset;
        }

        setSelectedPosition({ x: formX, y: formY });
    };

    const closeForm = () => {
        setFormVisible(false);
    };

    const handleClickOutside = (e) => {
        if (e.target.className === "drawing-container") {
            setSelectedElement(null);
        }
        setContextMenu({ visible: false });
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
    };

    const handleInputSubmit = (amountWithCurrency, instructions, availability) => {
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === selectedElement
              ? { ...el, content: amountWithCurrency, instructions, availability }
              : el
          )
        );
    };

    return (
        <div className="edit-container" onKeyDown={handleKeyDown} tabIndex="0" onClick={handleClickOutside}>
            <Header setTool={setTool} tool={tool} />
            <div
                className="drawing-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
            >
                {elements.map((el, idx) => {
                    const isSelected = el.id === selectedElement;
                    if (el.type === 'rectangle') {
                        return (
                            <Rectangle
                                key={el.id}
                                element={el}
                                isSelected={isSelected}
                                onClick={() => handleElementClick(el.id)}
                                onDoubleClick={() => handleDoubleClick(el.id)} // Double-click opens the form
                                onContextMenu={(e) => handleRightClick(e, el.id)}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            {contextMenu.visible && (
                <ul
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <li onClick={handleChoose}>Choose</li>
                    <li onClick={handleDelete}>Delete</li>
                </ul>
            )}

            {formVisible && (
                <div className="form-container" style={{ position: 'absolute', top: selectedPosition.y, left: selectedPosition.x }}>
                    <button onClick={closeForm}>
                        <img src='https://cdn-icons-png.flaticon.com/128/4034/4034637.png' alt='' />
                    </button>
                    <Inputs 
                        onSubmit={handleInputSubmit} 
                        onFocus={handleInputFocus} // Pass focus event handler
                        onBlur={handleInputBlur}   // Pass blur event handler
                    />
                </div>
            )}
        </div>
    );
};

export default Design;
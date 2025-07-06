import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useDocument } from '../../contexts/CustomizeContext';

function ImageElement({ el, selectedId, setSelectedId, imageSelectedId, setImageSelectedId }) {
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const { updateImage } = useDocument();

  const [size, setSize] = useState({ width: el.w, height: el.h });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        nodeRef.current &&
        !nodeRef.current.contains(event.target) &&
        !event.target.closest('[data-ignore-click-outside]')
      ) {
        setSelectedId(null);
        setImageSelectedId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSelectedId]);

  const handleResize = () => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setSize({ width: offsetWidth, height: offsetHeight });

      updateImage(el.id, {
        w: offsetWidth,
        h: offsetHeight,
      });
    }
  };

  const handleSingleClick = () => {
    if (imageSelectedId !== el.id) setImageSelectedId(null);
    setSelectedId(el.id);
  };

  const handleDoubleClick = () => {
    setImageSelectedId(el.id);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      disabled={imageSelectedId === el.id}
      defaultPosition={{ x: el.position.x, y: el.position.y }}
      onStop={(e, data) =>
        updateImage(el.id, {
          position: { x: data.x, y: data.y },
        })
      }
    >
      <div
        ref={nodeRef}
        data-ignore-click-outside
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          position: 'absolute',
          cursor: imageSelectedId === el.id ? 'default' : 'move',
          border: '2px dashed',
          borderColor: imageSelectedId === el.id ? '#2196f3' : selectedId === el.id ? '#888' : '#ccc',
          borderRadius: 4,
          padding: 2,
          backgroundColor: 'transparent',
        }}
      >
        <div
          ref={containerRef}
          onMouseUp={handleResize}
          style={{
            resize: imageSelectedId === el.id ? 'both' : 'none',
            overflow: 'hidden',
            width: size.width,
            height: size.height,
            minWidth: 50,
            minHeight: 50,
            maxWidth: `calc(100vw - ${el.position.x + 80}px)`,
            maxHeight: `calc(100vh - ${el.position.y + 80}px)`,
          }}
        >
          <img
            src={el.url}
            alt="editable"
            draggable={false} // <- ✅ previene il drag nativo dell’immagine
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: imageSelectedId === el.id ? 'auto' : 'none', // blocca interazioni quando non selezionata
              userSelect: 'none',
            }}
          />
        </div>
      </div>
    </Draggable>
  );
}

export { ImageElement };

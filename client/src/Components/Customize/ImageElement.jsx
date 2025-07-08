import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useDocument } from '../../contexts/CustomizeContext';

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

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
    if (containerRef.current && imageSelectedId === el.id) {
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

  const borderClass =
  imageSelectedId === el.id
    ? 'border-2 border-[#2196f3]'
    : selectedId === el.id
    ? 'border-2 border-[#888]'
    : 'hover:border-2 hover:border-[#ccc] border-2 border-transparent';

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
        className={`absolute rounded border-dashed p-0 ${borderClass}`}
        style={{
          cursor: imageSelectedId === el.id ? 'default' : 'move',
          backgroundColor: 'transparent',
        }}
      >
        <div
          ref={containerRef}
          onMouseUp={handleResize}
          style={{
            resize: imageSelectedId === el.id ? 'both' : 'none',
            overflow: 'hidden',
            width: el.w,
            height: el.h,
            minWidth: 50,
            minHeight: 50,
            maxWidth: PAGE_WIDTH - el.position.x - 80,
            maxHeight: PAGE_HEIGHT - el.position.y - 80,
          }}
        >
          <img
            src={el.url}
            alt="editable"
            draggable={false} // <- ✅ previene il drag nativo dell’immagine
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
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

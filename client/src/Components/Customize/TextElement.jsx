import Draggable from 'react-draggable';
import { TextareaAutosize } from "@mui/material"
import { useState, useEffect, useRef } from "react";
import { useDocument } from "../../contexts/CustomizeContext";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

function TextElement({el, selectedId, setSelectedId, textSelectedId, setTextSelectedId }){
    const ref = useRef(null);
    const nodeRef = useRef(null);
    const {updateTextBox} = useDocument()

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target) && !event.target.closest('[data-ignore-click-outside]')) {
        // Ritarda leggermente il reset per far eseguire prima altri onClick
        setSelectedId(null)
        setTextSelectedId(null)
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setSelectedId]);

    const handleDoubleClick = () => {
        setTextSelectedId(el.id)
        // Focus dopo un tick per assicurarsi che il componente venga aggiornato
        setTimeout(() => {
        const length = ref.current?.value.length;
        ref.current?.focus();
        ref.current?.setSelectionRange(length, length);
        }, 0);
    };

    const handleSingleClick = () =>{
        if (textSelectedId !== el.id) setTextSelectedId(null)
        setSelectedId(el.id)
    }

  const borderClass =
  textSelectedId === el.id
    ? 'border-2 border-[#2196f3]'
    : selectedId === el.id
    ? 'border-2 border-[#888]'
    : 'hover:border-2 hover:border-[#ccc] border-2 border-transparent';

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      disabled={textSelectedId === el.id}
      defaultPosition={{ x: el.position.x, y: el.position.y }}
      onStop={(e, data) =>
        updateTextBox(el.id, {
          position: { x: data.x, y: data.y },
        })
      }
    >
      <div ref={nodeRef} style={{ position: 'absolute' }} data-ignore-click-outside>
        {textSelectedId === el.id ? (
          <TextareaAutosize
            ref={ref}
            id={el.id}
            minRows={1}
            value={el.content}
            onChange={(e) => {
              console.log(e.target.value)
              updateTextBox(el.id, {
                content: e.target.value,
              })
            }
            }
            onMouseUp={() => {
              if (ref.current) {
                const { offsetWidth, offsetHeight } = ref.current;
                updateTextBox(el.id, {
                  w: offsetWidth,
                  h: offsetHeight - 16,
                });
              }
            }}
            placeholder="Text..."
            className={`absolute rounded border-dashed ${borderClass}`}
            style={{
              width: el.w,
              cursor: 'text',
              fontSize: el.textSize,
              fontWeight: el.bold ? 'bold' : 'normal',
              fontStyle: el.italic ? 'italic' : 'normal',
              textDecoration: el.underlined ? 'underline' : 'none',
              color: el.textColor,
              padding: '8px',
              outline: 'none',
              resize: 'both',
              minHeight: 50,
              minWidth: 100,
              maxWidth: PAGE_WIDTH - el.position.x - 80,
              maxHeight: PAGE_HEIGHT - el.position.y - 80,
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <div
          onClick={handleSingleClick}
          onDoubleClick={handleDoubleClick}
          
          className={`absolute rounded border-dashed ${borderClass}`}
            style={{
              
              cursor: selectedId === el.id? "move" : "pointer",
              width: el.w,
              minHeight: 50,
              minWidth: 100,
              whiteSpace: 'pre-wrap', // 🔥 Questo è ciò che rende visibili gli \n
              fontSize: el.textSize,
              fontWeight: el.bold ? 'bold' : 'normal',
              fontStyle: el.italic ? 'italic' : 'normal',
              textDecoration: el.underlined ? 'underline' : 'none',
              color: el.content? el.textColor: "#888",
              padding: '8px',
              
              background: 'transparent',
              boxSizing: 'border-box',
            }}
          >
            {el.content || 'Text...'}
          </div>
        )}
      </div>
    </Draggable>

  );
}

export {TextElement}
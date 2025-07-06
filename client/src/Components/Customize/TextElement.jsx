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
        ref.current?.focus();
        }, 0);
    };

    const handleSingleClick = () =>{
        if (textSelectedId !== el.id) setTextSelectedId(null)
        setSelectedId(el.id)
    }

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      disabled={textSelectedId === el.id} 
      defaultPosition={{ x: el.position.x, y: el.position.y }}
      onStop={(e, data) => updateTextBox(el.id,{
        position: {x:data.x, y: data.y}
      })}
      
    >
      <div ref={nodeRef} style={{ position: 'absolute' }} data-ignore-click-outside>
        
          <TextareaAutosize
            ref={ref}
            id={el.id}
            minRows={1}
            value={el.content}
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={(e) => {
                if (textSelectedId !== el.id) {
                e.preventDefault(); // previene il focus sul primo clic
                }
            }}
            onChange={(e) => updateTextBox(el.id, {
                content: e.target.value
            })}
            onBlur={() => {
            if (ref.current) {
                const { offsetWidth, offsetHeight } = ref.current;
                updateTextBox(el.id, {
                w: offsetWidth ,
                h: offsetHeight -16,
                });
            }
            }}
            placeholder="Text..."
            className= {textSelectedId !== el.id? "hover:border-[#888]" : ""}
            readOnly={textSelectedId !== el.id}
            style={{
              width: el.w,
              //height: el.h,
              cursor: textSelectedId === el.id? "text": "move",
              fontSize: el.textSize,
              fontWeight: el.bold ? "bold" : "normal",
              fontStyle: el.italic ? "italic" : "normal",
              textDecoration: el.underlined ? "underline" : "none",
              color: el.textColor,
              padding: '8px',
              border: '2px dashed',
              borderRadius: '6px',
              borderColor: textSelectedId === el.id ? '#2196f3' : selectedId === el.id? "#888" : '#ccc',
              outline: 'none',
              resize: textSelectedId === el.id? 'both': 'none',
              minHeight: 50,
              minWidth: 100,
              maxWidth: PAGE_WIDTH - el.position.x - 80,
              maxHeight: PAGE_HEIGHT - el.position.y - 80,
              boxSizing: 'border-box',
            }}
          />
        </div>
    </Draggable>
  );
}

export {TextElement}
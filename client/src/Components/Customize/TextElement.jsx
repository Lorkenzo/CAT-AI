import Draggable from 'react-draggable';
import { TextareaAutosize } from "@mui/material"
import { useState, useEffect, useRef } from "react";
import { useDocument } from "../../contexts/CustomizeContext";
import { useFormData } from "../../contexts/FormContext";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

function TextElement({el, selectedId, setSelectedId, textSelectedId, setTextSelectedId, snapX, setSnapX,snapY, setSnapY }){
    const ref = useRef(null);
    const nodeRef = useRef(null);
    const {updateTextBox, textBoxes, images} = useDocument()
    const {formData} = useFormData()

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

    const checkAlignmentX = (x, w) => {
      const SNAP_THRESHOLD = 5;
      const pageCenter = PAGE_WIDTH / 2;

      // Centro del blocco corrente
      const currentCenter = x + w / 2;
      // Verifica allineamento con il centro della pagina
      if (Math.abs(currentCenter - pageCenter) < SNAP_THRESHOLD) {
        return {x : pageCenter - w / 2, center: true}; // Snap al centro
      }
      // Verifica allineamento con sinistra di altri blocchi
      for (const box of textBoxes) {
        if (box.id === el.id || box.page !== el.page) continue; // ignora se stesso e le altre pagine

        if (Math.abs(x - box.position.x) < SNAP_THRESHOLD) {
          return {x : box.position.x, center: false}; // Snap alla sinistra di un altro box
        }
      }
      for (const box of images) {
        if (Math.abs(x - box.position.x) < SNAP_THRESHOLD) {
          return {x : box.position.x, center: false}; // Snap alla sinistra di un altro box
        }
      }
      return null;
    };

    const checkAlignmentY = (y, h) => {
      const SNAP_THRESHOLD = 5;
      const pageCenter = PAGE_HEIGHT / 2;

      // Centro del blocco corrente
      const currentCenter = y + h / 2;
      // Verifica allineamento con il centro della pagina
      if (Math.abs(currentCenter - pageCenter) < SNAP_THRESHOLD) {
        return {y : pageCenter - h / 2, center: true}; // Snap al centro
      }
      // Verifica allineamento con sinistra di altri blocchi
      for (const box of textBoxes) {
        if (box.id === el.id || box.page !== el.page) continue; // ignora se stesso e le altre pagine

        if (Math.abs(y - box.position.y) < SNAP_THRESHOLD) {
          return {y : box.position.y, center: false}; // Snap alla sinistra di un altro box
        }
      }
      for (const box of images) {
        if (Math.abs(y - box.position.y) < SNAP_THRESHOLD) {
          return {y : box.position.y, center: false}; // Snap alla sinistra di un altro box
        }
      }
      return null;
    };

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

  const getFontClass = (font) => {
        return font ? `font-${font}` : '';
    };

  useEffect(()=>{
    if (el.id === selectedId) console.log(el.position)
  },[textBoxes])

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      disabled={textSelectedId === el.id}
      position={{ x: el.position.x, y: el.position.y }}
      onStop={(e, data) => {
        updateTextBox(el.id, {
          position: { x: snapX? snapX.x : data.x, y: snapY? snapY.y : data.y },
        })
        if (snapX) setSnapX(null)
        if (snapY) setSnapY(null)
      }}
      onDrag={(e, data) => {
      const snapx = checkAlignmentX(data.x, el.w);
      setSnapX(snapx);
      const snapy = checkAlignmentY(data.y, el.h);
      setSnapY(snapy);
    }}
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
                  h: offsetHeight,
                });
              }
            }}
            placeholder="Text..."
            className={` rounded border-dashed ${borderClass} ${getFontClass(formData.style[formData.selectedStyle].font.value)}`}
            style={{
              width: el.w,
              height: el.h,
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
              maxWidth: PAGE_WIDTH - el.position.x ,
              maxHeight: PAGE_HEIGHT - el.position.y ,
              boxSizing: 'border-box',
              zIndex: 200
            }}
          />
        ) : (
          <div
          onClick={handleSingleClick}
          onDoubleClick={handleDoubleClick}
          ref={ref}
          className={` rounded border-dashed ${borderClass} ${getFontClass(formData.style[formData.selectedStyle].font.value)}`}
            style={{
              cursor: selectedId !== el.id? "move" : "pointer",
              width: el.w,
              height: el.h,
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
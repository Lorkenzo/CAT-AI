import { Header } from "./Header"
import { Stack, Tooltip, Button, IconButton, TextField, TextareaAutosize, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { useRef, useState, useEffect } from "react";
import { useDocument } from "../contexts/CustomizeContext";
import { ColorPicker } from "./ColorPicker";
import Draggable from 'react-draggable';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

function Customize({fullScreen, setFullScreen}) {
    const {textBoxes,images,addTextBox,updateTextBox,deleteTextBox,addImage,updateImage,deleteImage} = useDocument()

    const wrapperRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [textSelectedId, setTextSelectedId] = useState(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const ZOOM_STEP = 0.1;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 1.5;

    const zoomIn = () => setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));

    const deleteElem = () =>{
        deleteTextBox(selectedId)
        setSelectedId(null)
        setTextSelectedId(null)
    }

    useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !textSelectedId) {
        // Verifica se l'id selezionato è una textbox o un'immagine
        const isText = textBoxes.some(el => el.id === selectedId);
        const isImage = images.some(img => img.id === selectedId);

        if (isText) deleteTextBox(selectedId);
        else if (isImage) deleteImage(selectedId);

        setSelectedId(null);
        setTextSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteTextBox, deleteImage, textBoxes, images]);

    useEffect(() => {
        function handleResize() {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const availableWidth = wrapper.clientWidth;
        const newScale = Math.min(availableWidth / PAGE_WIDTH, 1);
        setScale(newScale);

        // Calcola offset orizzontale per centrare la pagina scalata
        const scaledWidth = PAGE_WIDTH * newScale;
        const horizontalOffset = (availableWidth - scaledWidth) / 2;
        setOffsetX(Math.max(horizontalOffset, 0)); // Evita valori negativi
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(()=>{
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const availableWidth = wrapper.clientWidth;
        const scaledWidth = PAGE_WIDTH * scale;
        const offset = (availableWidth - scaledWidth) / 2;
        setOffsetX(Math.max(offset, 0));
    },[scale])


    return (
        <div className="flex flex-col w-full h-full items-center">
        {!fullScreen && <Header stepnumber={1}></Header>}
            <div className={`flex flex-col w-full ${fullScreen?"h-full":"h-[85%]"} items-center mb-3`}>
                <HorizontalToolBar zoomIn={zoomIn} zoomOut={zoomOut} scale={scale} fullScreen={fullScreen} setFullScreen={setFullScreen}></HorizontalToolBar>
                <div className="flex flex-row w-full h-full justify-center">
                    <div
                    ref={wrapperRef}
                    className="relative w-[85%] h-full overflow-auto bg-gray-100 pt-3" 
                    >
                        {/* Contenuto centrato con offset dinamico */}
                        <div
                            className="absolute origin-top-left"
                            style={{
                            width: PAGE_WIDTH,
                            height: PAGE_HEIGHT,
                            transform: `translateX(${offsetX}px) scale(${scale})`,
                            }}
                        >
                            <div className="relative w-full h-full bg-white border border-gray-300 drop-shadow-md p-10 text-xl">
                                {textBoxes.map((el) => (
                                    <TextElement key={el.id} el={el} selectedId={selectedId} setSelectedId={setSelectedId} textSelectedId={textSelectedId} setTextSelectedId={setTextSelectedId}></TextElement>
                                ))}
                            </div>
                        
                        </div>
                        
                    </div>
                    <VerticalToolbar selectedId={selectedId} setSelectedId={setSelectedId} setTextSelectedId={setTextSelectedId}></VerticalToolbar>
                </div>
            </div>
        </div>
    );
}

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

function HorizontalToolBar({zoomIn,zoomOut,scale,fullScreen,setFullScreen}){

    return(
        <div className="flex w-[90%] h-[10%] justify-between">
            <div className="flex gap-2 items-center my-2" data-ignore-click-outside>
                <Tooltip title="Undo" placement="bottom">
                    <IconButton>
                    <UndoIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Redo" placement="bottom" className="mr-2">
                    <IconButton>
                    <RedoIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zoom Out" placement="bottom">
                    <IconButton onClick={zoomOut}>
                    <ZoomOutIcon />
                    </IconButton>
                </Tooltip>
                <span>{Math.round(scale * 100)}%</span>
                <Tooltip title="Zoom In" placement="bottom" className="mr-2">
                    <IconButton onClick={zoomIn}>
                    <ZoomInIcon />
                    </IconButton>
                </Tooltip>
                <IconButton onClick={()=>setFullScreen((prev)=>!prev)}>
                    {fullScreen?
                    <FullscreenExitIcon></FullscreenExitIcon>:
                    <FullscreenIcon></FullscreenIcon>}
                </IconButton>
                
            </div>
            <div className="flex w-1/3" data-ignore-click-outside>
                    <TextField fullWidth label="Exercise Title" variant="standard"></TextField>
                </div>
            <div className="flex items-center my-2" data-ignore-click-outside>
                <Button variant="contained" endIcon={<NavigateNextIcon></NavigateNextIcon>}>Export</Button>
            </div>
        </div>
    )
}

function VerticalToolbar({selectedId, setSelectedId, setTextSelectedId}) {
    const [regenOpen, setRegenOpen] = useState(false)
    const [textFormat, setTextFormat] = useState([]);
    const {textBoxes, images, updateTextBox, deleteTextBox, addTextBox} = useDocument()
    const [increseEnabled, setIncreaseEnabled] = useState(true)
    const [decreseEnabled, setDecreaseEnabled] = useState(true)

    const isText = textBoxes.some(el => el.id === selectedId);
    const isImage = images.some(img => img.id === selectedId);

    const handleRegenToggle = (event, value) => {
        setRegenOpen(value);
    };

    const handleDelete= () =>{

        if (isText) deleteTextBox(selectedId);
        else if (isImage) deleteImage(selectedId);

        setSelectedId(null);
        setTextSelectedId(null);
    }

    const handleFontSize = (increase) =>{
        const elem = textBoxes.find(e => e.id === selectedId)
        if (!elem) return;

        if (increase){
            updateTextBox(selectedId,{
                textSize: elem.textSize + 2
            })
            if (elem.textSize + 2 >= 24) setIncreaseEnabled(false)
            if (!decreseEnabled) setDecreaseEnabled(true)
        }
        else{
            updateTextBox(selectedId,{
                textSize: elem.textSize - 2
            })
            if (elem.textSize - 2 <= 12) setDecreaseEnabled(false)
            if (!increseEnabled) setIncreaseEnabled(true)
        }
    }

    const handleTextFormat = (event, newFormats) => {
        setTextFormat(newFormats);

        const elem = textBoxes.find(e => e.id === selectedId);
        if (!elem) return;

        updateTextBox(selectedId, {
            bold: newFormats.includes("bold"),
            italic: newFormats.includes("italic"),
            underlined: newFormats.includes("underlined"),
        });
    };

    useEffect(()=>{
        if (isText) {
            const elem = textBoxes.find(e => e.id === selectedId);
            if (!elem) return;
            let elemFormat = []
            if (elem.bold) elemFormat.push('bold')
            if (elem.italic) elemFormat.push('italic')
            if (elem.underlined) elemFormat.push('underlined')
            setTextFormat(elemFormat)
        }
        else(
            setTextFormat([])
        )
    },[selectedId, textBoxes])

    return (
        <Stack direction="column" spacing={1} sx={{
            width: 64,
            display:"flex",
            alignItems: 'center',
            py:1
        }}>
            <ToggleButtonGroup orientation="vertical" color="primary" 
            exclusive
            value={regenOpen} 
            onChange={handleRegenToggle}>
                <Tooltip title="Generate Again" placement="right">
                    <ToggleButton value="full" data-ignore-click-outside>
                    <AutoModeIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Regenarate Element" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="element" disabled={selectedId===null} >
                    <GeneratingTokensIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical">
                <Tooltip title="Add Text" placement="right">
                    <ToggleButton value="text" onClick={addTextBox} data-ignore-click-outside>
                    <TextFieldsIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Add Image" placement="right">
                    <ToggleButton value="image" data-ignore-click-outside>
                    <AddPhotoAlternateIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Delete" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="delete" disabled={selectedId===null} onClick={()=>handleDelete()}>
                    <DeleteIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical">
                <Tooltip title="Decrease Text Size" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="increase" disabled={!isText || !decreseEnabled} onClick={()=>handleFontSize(false)}>
                    <TextDecreaseIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>

                <Tooltip title="Increase Text Size" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="decrease" disabled={!isText || !increseEnabled} onClick={()=>handleFontSize(true)}>
                    <TextIncreaseIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>

                <TextColorButton selectedId={selectedId} isText={isText}></TextColorButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical"
            value={isText? textFormat: []} 
            onChange={handleTextFormat}>
                <Tooltip title="Bold" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="bold" disabled={!isText}>
                    <FormatBoldIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>

                <Tooltip title="Italic" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="italic" disabled={!isText} >
                    <FormatItalicIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>

                <Tooltip title="Underlined" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="underlined" disabled={!isText}>
                    <FormatUnderlinedIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>
            </ToggleButtonGroup>
        </Stack>
    );
}

const TextColorButton = ({ selectedId, isText }) => {
  const { textBoxes, updateTextBox } = useDocument();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const currentColor =
    selectedId && textBoxes.find((b) => b.id === selectedId)?.textColor;

  const handleColorChange = (newColor) => {
    console.log(newColor)
    if (selectedId) {
      updateTextBox(selectedId, { textColor: newColor });
    }
  };

  return (
    <>
      <Tooltip title="Change Text Color" placement="right">
        <div data-ignore-click-outside>
          <ToggleButton
            value="textcolor"
            disabled={!isText}
            onClick={handleOpen}
            
          >
            <FormatColorTextIcon />
          </ToggleButton>
        </div>
      </Tooltip>

      <ColorPicker
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        color={currentColor || "#000000"}
        onChange={handleColorChange}
      />
    </>
  );
};


export {Customize}
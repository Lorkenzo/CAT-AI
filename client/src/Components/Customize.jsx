import { Header } from "./Header"
import { Stack, Tooltip, Button, IconButton, TextField, TextareaAutosize, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { useRef, useState, useEffect } from "react";
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
    const wrapperRef = useRef(null);
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const ZOOM_STEP = 0.1;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 1.5;

    const zoomIn = () => setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    const zoomOut = () => setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));

    const addTextBox = () => {
        const newElement = {
            id: Date.now(), // oppure uuid()
            content: '',
            position: { x: 16, y: 16 }, // posizione iniziale
        };

        setElements(prev => [...prev, newElement]);
    };

    const updateContent = (id, value) => {
        setElements(prev =>
        prev.map(el => (el.id === id ? { ...el, content: value } : el))
        );
    };

    const deleteElem = () =>{
        console.log("Deleting ID:", selectedId);
        console.log(selectedId)
        setElements(prev => prev.filter(e=> e.id !== selectedId))
        setSelectedId(null)
    }

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
                                {elements.map((el) => (
                                    <TextElement key={el.id} el={el} updateContent={updateContent} selectedId={selectedId} setSelectedId={setSelectedId}></TextElement>
                                ))}
                            </div>
                        
                        </div>
                        
                    </div>
                    <VerticalToolbar addTextBox={addTextBox} deleteElem={deleteElem} selectedId={selectedId}></VerticalToolbar>
                </div>
            </div>
        </div>
    );
}

function TextElement({el, updateContent, selectedId, setSelectedId}){
    const ref = useRef(null);
    const nodeRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
        // Ritarda leggermente il reset per far eseguire prima altri onClick
        setTimeout(() => setSelectedId(null), 500);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setSelectedId]);

    const handleDoubleClick = () => {
        setSelectedId(el.id);
        // Focus dopo un tick per assicurarsi che il componente venga aggiornato
        setTimeout(() => {
        ref.current?.focus();
        }, 0);
    };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      disabled={selectedId === el.id} 
      defaultPosition={{ x: el.position.x, y: el.position.y }}
      onStop={(e, data) => {
        el.position = { x: data.x, y: data.y }; // aggiorna stato esterno se serve
      }}
      
    >
      <div ref={nodeRef} style={{ position: 'absolute' }}>
        
          <TextareaAutosize
            ref={ref}
            id={el.id}
            value={el.content}
            onDoubleClick={handleDoubleClick}
            onMouseDown={(e) => {
                if (selectedId !== el.id) {
                e.preventDefault(); // previene il focus sul primo clic
                }
            }}
            onChange={(e) => updateContent(el.id, e.target.value)}
            placeholder="Text..."
            className= {selectedId !== el.id? "hover:border-[#888]" : ""}
            readOnly={selectedId !== el.id}
            style={{
              cursor: selectedId === el.id? "text": "move",
              
              fontSize: '1rem',
              padding: '8px',
              border: '2px dashed',
              borderRadius: '6px',
              borderColor: selectedId === el.id ? '#2196f3' : '#ccc',
              backgroundColor: 'white',
              outline: 'none',
              resize: selectedId === el.id? 'both': 'none',
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
            <div className="flex gap-2 items-center my-2">
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
            <div className="flex w-1/3">
                    <TextField fullWidth label="Exercise Title" variant="standard"></TextField>
                </div>
            <div className="flex items-center my-2">
                <Button variant="contained" endIcon={<NavigateNextIcon></NavigateNextIcon>}>Export</Button>
            </div>
        </div>
    )
}

function VerticalToolbar({addTextBox,deleteElem, selectedId}) {
    const [regenOpen, setRegenOpen] = useState(false)
    const [textFormat, setTextFormat] = useState([]);

    const handleTextFormat = (event, newFormats) => {
        setTextFormat(newFormats);
    };
    const handleRegen = (event, value) => {
        setRegenOpen(value);
    };

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
            onChange={handleRegen}>
                <Tooltip title="Generate Again" placement="right">
                    <ToggleButton value="full">
                    <AutoModeIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Regenarate Element" placement="right">
                    <ToggleButton value="element">
                    <GeneratingTokensIcon />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical">
                <Tooltip title="Add Text" placement="right">
                    <ToggleButton value="text" onClick={addTextBox}>
                    <TextFieldsIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Add Image" placement="right">
                    <ToggleButton value="image">
                    <AddPhotoAlternateIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Delete" placement="right">
                    <div>
                    <ToggleButton value="delete" disabled={selectedId===null} onClick={()=>deleteElem()}>
                    <DeleteIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical">
                <Tooltip title="Decrease Text Size" placement="right">
                    <ToggleButton value="increase">
                    <TextDecreaseIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Increase Text Size" placement="right">
                    <ToggleButton value="decrease">
                    <TextIncreaseIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Change Text Color" placement="right">
                    <ToggleButton value="textcolor">
                    <FormatColorTextIcon />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>

            <ToggleButtonGroup orientation="vertical"
            value={textFormat} 
            onChange={handleTextFormat}>
                <Tooltip title="Bold" placement="right">
                    <ToggleButton value="bold">
                    <FormatBoldIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Italic" placement="right">
                    <ToggleButton value="italic">
                    <FormatItalicIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Underlined" placement="right">
                <ToggleButton value="underlined">
                    <FormatUnderlinedIcon />
                </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
        </Stack>
    );
}


export {Customize}
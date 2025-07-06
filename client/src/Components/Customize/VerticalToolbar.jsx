import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteIcon from '@mui/icons-material/Delete';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { useDocument } from "../../contexts/CustomizeContext";
import AutoModeIcon from '@mui/icons-material/AutoMode';
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens';
import { useState, useEffect } from "react";
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip, Box, TextField, Popover, Typography, Button } from '@mui/material';
import { ColorPicker } from './ColorPicker';

function VerticalToolbar({selectedId, setSelectedId, setTextSelectedId}) {
    const [textFormat, setTextFormat] = useState([]);
    const {textBoxes, images, updateTextBox, deleteTextBox, addTextBox, updateImage, deleteImage, addImage} = useDocument()
    const [increseEnabled, setIncreaseEnabled] = useState(true)
    const [decreseEnabled, setDecreaseEnabled] = useState(true)
    const [regenOpen, setRegenOpen] = useState(null); 
    const [anchorEl, setAnchorEl] = useState(null);  

    const isText = textBoxes.some(el => el.id === selectedId);
    const isImage = images.some(img => img.id === selectedId);

    const handleRegenToggle = (event, newValue) => {
    if (regenOpen === newValue) {
        setRegenOpen(null);
        setAnchorEl(null);
    } else {
        setRegenOpen(newValue);
        setAnchorEl(event.currentTarget);
    }
    };

    const handlePopoverClose = () => {
        setRegenOpen(null);
        setAnchorEl(null);
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
            <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            exclusive
            value={regenOpen}
            onChange={handleRegenToggle}
            >
                <Tooltip title="Generate Again" placement="right">
                    <ToggleButton data-ignore-click-outside value="full">
                    <AutoModeIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Regenerate Element" placement="right">
                    <div data-ignore-click-outside>
                    <ToggleButton value="element" disabled={selectedId === null}>
                    <GeneratingTokensIcon />
                    </ToggleButton>
                    </div>
                </Tooltip>
            </ToggleButtonGroup>

            <RegenPopover
            anchorEl={anchorEl}
            open={Boolean(regenOpen)}
            onClose={handlePopoverClose}
            mode={regenOpen}
            />

            <ToggleButtonGroup orientation="vertical">
                <Tooltip title="Add Text" placement="right">
                    <ToggleButton value="text" onClick={addTextBox} data-ignore-click-outside>
                    <TextFieldsIcon />
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Add Image" placement="right">
                    <ToggleButton value="image" onClick={()=>addImage("")} data-ignore-click-outside>
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
  const [isOpen, setIsOpen] = useState(null);
  const [currentColor, setCurrentColor] = useState("#000000")

  const buttonColor = textBoxes.find(e => e.id === selectedId)?.textColor

  const handleOpen = (event) => {
    setIsOpen(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpen(null);
    if (selectedId) {
      updateTextBox(selectedId, { textColor: currentColor });
    }
}
  const handleColorChange = (e) => {
    setCurrentColor(e.target.value)
  };

  const onColorClick = (color) => {
    
    if (selectedId) {
      updateTextBox(selectedId, { textColor: color });
    }
    setCurrentColor(color)
  }

  return (
    <>
      <Tooltip title="Change Text Color" placement="right">
        <div data-ignore-click-outside>
          <ToggleButton
            value="textcolor"
            disabled={!isText}
            onClick={handleOpen}
            sx={{
                color: Boolean(isOpen)? currentColor: isText? buttonColor : ""
            }}
          >
            <FormatColorTextIcon />
          </ToggleButton>
        </div>
      </Tooltip>

      <ColorPicker
        anchorEl={isOpen}
        open={Boolean(isOpen)}
        onClose={handleClose}
        color={buttonColor}
        onChange={handleColorChange}
        onColorClick={onColorClick}
      />
    </>
  );
};

function RegenPopover({anchorEl,open, onClose, mode}){
    const [regenMode, setRegenMode] = useState(null)

    useEffect(()=>{
        if (mode==="full") setRegenMode("Exercise")
        if (mode ==="element") setRegenMode("Element")

    },[mode])

    return(
        <Popover
        data-ignore-click-outside
        open = {open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}>
            <Box sx={{
                width: 300,
                height:280,
                p:2,
                backgroundColor: "#efefef",
                
            }}>
            <Stack direction="column" spacing={2}>
                <div className="flex flex-row justify-start items-center">
                    {regenMode==="Exercise"?<AutoModeIcon fontSize="small" className="mr-2 align-middle"/>:<GeneratingTokensIcon fontSize="small" className="mr-2 align-middle"></GeneratingTokensIcon>}
                    <Typography variant="body1">Regenerate {regenMode}</Typography>
                </div>
                <TextField multiline minRows={4} maxRows={4} variant="outlined" color="primary" placeholder="I would like..." helperText="Specify what you would like to change" 
                ></TextField>
                <Button variant="contained">Regenerate</Button>

            </Stack>
            </Box>
        </Popover>
    )
}

export {VerticalToolbar}
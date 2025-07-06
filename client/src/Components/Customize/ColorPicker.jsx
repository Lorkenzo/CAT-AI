import React, { useRef } from "react";
import { Popover, Stack, IconButton } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorPicker = ({ anchorEl, open, onClose, color, onChange, onColorClick }) => {

  return (
    <Popover
      data-ignore-click-outside
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Stack direction="row" p={1}>
        <IconButton onClick={()=>onColorClick("#ffffff")} size="small"><CircleIcon fontSize="small" sx={{color: "#ffffff", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>
        <IconButton onClick={()=>onColorClick("#000000")} size="small"><CircleIcon fontSize="small" sx={{color: "#000000", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>
        <IconButton onClick={()=>onColorClick("#2196f3")} size="small"><CircleIcon fontSize="small" sx={{color: "#2196f3", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>

        {/* Bottone con icona palette */}
        <IconButton>
          <PaletteIcon sx={{
            color
          }}/>
          <input
            type="color"
            onMouseUp={()=>console.log("end")}
            onChange={onChange}
            style={{
              opacity: 0,
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </IconButton>

      </Stack>
    </Popover>
  );
};

export { ColorPicker };

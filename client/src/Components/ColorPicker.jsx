// components/ColorPickerPopover.jsx

import React from "react";
import { Popover, Box } from "@mui/material";
import { ChromePicker } from "react-color";

const ColorPicker = ({ anchorEl, open, onClose, color, onChange }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 2 }}>
        <ChromePicker
          color={color || "#000000"}
          onChange={(color) => onChange(color.hex)}
        />
      </Box>
    </Popover>
  );
};

export {ColorPicker};

import { Typography, Autocomplete, TextField, Box, Stack, IconButton } from "@mui/material";
import { useFormData } from "../../contexts/FormContext";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';

const fontOptions = [
  { label: "Inter", value: "inter" },
  { label: "Roboto", value: "roboto" },
  { label: "Open Sans", value: "opensans" },
  { label: "Lato", value: "lato" },
  { label: "Montserrat", value: "montserrat" },
  { label: "Poppins", value: "poppins" },
  { label: "Raleway", value: "raleway" },
  { label: "Merriweather", value: "merriweather" },
  { label: "Playfair Display", value: "playfair" },
  { label: "Fira Code", value: "firacode" }
];

function StyleSettings(){
    const {formData, setFormData} = useFormData()
    const [currentFont, setCurrentFont] = useState(formData.style[formData.selectedStyle].font.value)
    
    const getFontClass = (font) => {
        return font ? `font-${font}` : '';
    };

    useEffect(()=>{
        const fontClass = getFontClass(formData.style[formData.selectedStyle].font.value);
        setCurrentFont(fontClass)
        console.log(fontClass)
    },[formData.style[formData.selectedStyle].font])

    const handleStyleChange = (name) => (event,value) => {
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFontChange = (selectedStyle) => (event, value) => {
  setFormData(prev => ({
    ...prev,
    style: {
      ...prev.style,
      [selectedStyle]: {
        ...prev.style[selectedStyle],
        font: value
      }
    }
  }));
};
    return(
        <div className="flex flex-col">
            <div className="flex flex-row justify-around pt-3">
                <div className="flex justify-start w-1/2">
                <Typography>Style</Typography>
                </div>
                <div className="flex justify-start w-1/2">
                <Autocomplete 
                fullWidth
                name="style"
                disableClearable
                value={formData.style[formData.selectedStyle].name}
                options={["MyStyle", "Formal", "Playful"]} 
                sx={{ maxWidth: 150 }}
                onChange={handleStyleChange("selectedStyle")}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Select" size="small"/>
                )}></Autocomplete>
                </div>
            </div> 
            <div className="flex flex-row justify-around pt-3">
                <div className="flex justify-start w-1/2">
                <Typography>Font</Typography>
                </div>
                <div className="flex justify-start w-1/2">
                <Autocomplete 
                className={`${currentFont}`}
                name="font"
                fullWidth
                disableClearable
                value={formData.style[formData.selectedStyle].font}
                options={fontOptions} 
                getOptionLabel={(option) => option.label}
                sx={{ maxWidth: 150 }}
                onChange={handleFontChange(formData.selectedStyle)}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return(
                    <Box
                        key={key}
                        component="li"
                        {...optionProps}
                        className={`p-1 cursor-pointer ${getFontClass(option.value)} hover:bg-gray-100`}
                    >
                        {option.label}
                    </Box>
                    )
                }}
                renderInput={(params) => (
                <TextField
                {...params}
                variant="outlined"
                label="Select"
                size="small"
                slotProps={{
                    input:{
                        ...params.InputProps,
                        className: `${params.InputProps?.className || ''} ${currentFont}`,
                    }
                }}
                />
                )}
                ></Autocomplete>
                </div>
            </div>
            <div className="flex flex-row justify-around py-3">
                <div className="flex justify-start w-1/2">
                <Typography>Palette</Typography>
                </div>

                <div className="flex justify-start w-1/2">
                <IconButton onClick={()=>{}} size="small"><CircleIcon fontSize="small" sx={{color: "#ffffff", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>
                <IconButton onClick={()=>{}} size="small"><CircleIcon fontSize="small" sx={{color: "#000000", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>
                <IconButton onClick={()=>{}} size="small"><CircleIcon fontSize="small" sx={{color: "#2196f3", border: "2px solid #ccc", borderRadius: "50%"}}/></IconButton>

                {/* Bottone con icona palette */}
                <IconButton>
                <AddIcon/>
                <input
                    type="color"
                    
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

                </div>
            </div>
            
        </div>
    )
}

export {StyleSettings}
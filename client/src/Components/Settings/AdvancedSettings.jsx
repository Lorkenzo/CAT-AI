import { Typography, Autocomplete, TextField, InputAdornment, Switch, Box } from "@mui/material";

function AdvancedSettings({newSettings, setNewSettings}){

    const handleAutocompleteChange = (name) => (event,value) => {
        setNewSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return(
        <div className="flex flex-col">
            <div className="flex flex-row justify-around pt-3">
                <div className="flex justify-start w-1/2">
                <Typography>Answer Confidence</Typography>
                </div>
                <div className="flex justify-start w-1/2">
                <Autocomplete 
                fullWidth
                name="confidence"
                disableClearable
                value={newSettings.confidence}
                options={["95","99"]} 
                sx={{ maxWidth: 150 }}
                onChange={handleAutocompleteChange("confidence")}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Select" size="small" 
                    slotProps={{
                        input: {
                        ...params.InputProps,
                        endAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <InputAdornment position="end">%</InputAdornment>
                            {params.InputProps.endAdornment}
                        </Box>
                        ),
                        },
                    }}/>
                )}></Autocomplete>
                </div>
            </div> 
            <div className="flex flex-row justify-around pt-3">
                <div className="flex flex-col justify-start w-1/2">
                <Typography>Dislexia Inclusive</Typography>
                <Typography variant="caption">Big font - High Contrast</Typography>
                </div>
                <div className="flex justify-start w-1/2">
                    <Switch
                        checked={newSettings.dislexiaInclusive}
                        onChange={(e) =>
                        setNewSettings((prev) => ({
                            ...prev,
                            dislexiaInclusive: e.target.checked,
                        }))
                        }
                    />
                </div>
            </div> 
            <div className="flex flex-row justify-around py-3">
                
                
            </div>
        </div>
    )
}

export {AdvancedSettings}
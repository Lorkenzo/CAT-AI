import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tab, Tabs, Typography, Autocomplete, TextField } from "@mui/material";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from "react";
import { GeneralSettings } from "./GeneralSettings";
import { StyleSettings } from "./StyleSettings";
import { AdvancedSettings } from "./AdvancedSettings";

function Settings({isSettingOpened, setIsSettingOpened}) {

    const [currentSetting, setCurrentSetting] = useState(0)
    return(
        <Dialog
        open={isSettingOpened}
        >
            <DialogTitle className="flex items-center gap-3"><SettingsSuggestIcon />Generation Settings</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
                <Tabs variant="fullWidth" value={currentSetting}>
                    <Tab icon={<SettingsIcon/>} iconPosition="start" label="General" onClick={()=>setCurrentSetting(0)}/>
                    <Tab icon={<PaletteIcon/>} iconPosition="start" label="Style" onClick={()=>setCurrentSetting(1)}/>
                    <Tab icon={<TuneIcon/>} iconPosition="start" label="Advanced" onClick={()=>setCurrentSetting(2)}/>
                </Tabs>
                <TabPanel index={currentSetting}></TabPanel>
                <DialogActions>
                    <Button color="primary" variant="outlined" onClick={()=>setIsSettingOpened(false)}>Cancel</Button>
                    <Button color="primary" variant="contained">Apply</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

function TabPanel({index}){

    return(
        index === 0?
        <GeneralSettings></GeneralSettings>
        : index === 1?
        <StyleSettings></StyleSettings>
        : index === 2?
        <AdvancedSettings></AdvancedSettings>
        : <></>
    )
}

export {Settings}

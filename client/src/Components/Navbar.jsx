import AppBar from "@mui/material/AppBar";
import Typography from '@mui/material/Typography';
import { IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';

function NavBar({setIsSettingOpened}){
    const navigate = useNavigate()

    return ( 
        <AppBar position="static">
            <Toolbar>
            <img src="src\assets\logocatai.png" className="max-h-16">
            </img>
            <Typography onClick={()=>navigate("/")} className="cursor-pointer" variant="h6" component="div" sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1 
            }}>
                CAT-AI
            </Typography>
            <IconButton color="inherit" size="large" onClick={()=>{setIsSettingOpened(true)}}><SettingsIcon></SettingsIcon></IconButton>
            
            </Toolbar>
        </AppBar>
    )
}

export {NavBar}
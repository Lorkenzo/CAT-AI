import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { Tooltip, TextField, Button, IconButton } from '@mui/material';

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

export {HorizontalToolBar}

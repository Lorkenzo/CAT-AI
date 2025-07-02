import { Backdrop } from "@mui/material";

function Settings({isSettingOpened, setIsSettingOpened}) {
    return(
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isSettingOpened}
        onClick={()=>setIsSettingOpened(false)}>

        </Backdrop>
    )
}

export {Settings}

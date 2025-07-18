import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { Tooltip, TextField, Button, IconButton } from '@mui/material';
import { useDocument } from '../../contexts/CustomizeContext';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API from '../../API/API.mjs';
import { useExportData } from '../../contexts/ExportData';
import { useState } from 'react';

function HorizontalToolBar({zoomIn,zoomOut,scale,fullScreen,setFullScreen, setSelectedId, setTextSelectedId, setImageSelectedId, setExporting,exercisePage, handlePageSwitch}){
    const navigate = useNavigate()
    const [title, setTitle] = useState("Exercise")
    const {undo, redo, history, redoStack} = useDocument()
    const {exportData, setExportData} = useExportData()

    const generatePdfFromDocument = async (element, headingHTML, title) => {

        // Temp No Border
        const originalBorder = element.style.border;
        element.style.border = "none";

        // Temp Heading
        const heading = document.createElement('div');
        if (headingHTML !== ""){
        heading.innerHTML = headingHTML;
        element.insertBefore(heading, element.firstChild);
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        // Restore Style
        element.style.border = originalBorder;

        if (headingHTML !== ""){
            heading.remove()
        }

        const blob = pdf.output('blob');
        const formData = new FormData();
        formData.append('file', blob, `document_${title}.pdf`);

        try {
            const response = await API.handleUploadFile(formData);
            console.log('PDF salvato su:', response.url);
            return response.url;
        } catch (error) {
            console.error('Errore durante upload PDF:', error);
        }
    };

    const headingHTML = `
        <div style="border-bottom: 1px solid #ccc; padding: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <div><strong>Nome:</strong></div>
            <div><strong>Cognome:</strong></div>
            <div style="margin-right:100px;"><strong>Data:</strong></div>
        </div>
        </div>
    `;

    const handleExport = async () =>{
        setSelectedId(null);
        setTextSelectedId(null);
        setImageSelectedId(null);

        const exercise = document.getElementById('document');
        const answer = document.getElementById('answer');

        setExporting(true)
        
        const url = await generatePdfFromDocument(exercise,"","exercise")
        const urlHeading = await generatePdfFromDocument(exercise,headingHTML,"heading")
        const urlAnswer = await generatePdfFromDocument(answer,"","answer")

        setExportData(prev => ({
            ...prev,
            url,
            urlHeading,
            urlAnswer,
        }))

        setTimeout(()=>{
            navigate("/export")
            setExporting(false)
        },[1000])
    }

    return(
        <div className="flex w-[90%] h-[10%] justify-between">
            <div className="flex gap-2 items-center" data-ignore-click-outside>
                <Tooltip title="Undo" placement="bottom">
                    <div>
                    <IconButton onClick={undo} disabled={history.length === 0}>
                    <UndoIcon />
                    </IconButton>
                    </div>
                </Tooltip>

                <Tooltip title="Redo" placement="bottom" className="mr-2">
                    <div>
                    <IconButton onClick={redo} disabled={redoStack.length === 0}>
                    <RedoIcon />
                    </IconButton>
                    </div>
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
            <div className="flex items-center w-1/3" data-ignore-click-outside>
                    <TextField value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth label="Exercise Title" variant="standard"></TextField>
                </div>
            <div className="flex items-center gap-3" data-ignore-click-outside>
                <Button onClick={handlePageSwitch} variant="outlined" endIcon={<SwapVertIcon className={`${exercisePage === 1 && "-scale-x-[1]"}`}></SwapVertIcon>}>{exercisePage===1?"Solution":"Exercise"}</Button>
                <Button onClick={handleExport} variant="contained" endIcon={<NavigateNextIcon></NavigateNextIcon>}>Export</Button>
            </div>
        </div>
    )
}

export {HorizontalToolBar}

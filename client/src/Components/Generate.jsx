import { useEffect, useState } from "react"
import { Header } from "./Header"
import { FileUploader } from "./Uploader"
import Edit from "@mui/icons-material/Edit"
import { Button, Divider, IconButton, Typography, TextField, Autocomplete, Chip,FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox } from "@mui/material"
import UploadFileImg from "../assets/uploadfile.png"
import FillManuallyImg from "../assets/fillmanually.png"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useFormData } from "../contexts/FormContext"

function Generate(){
    const [file, setFile] = useState(null);
    return(
    <Routes>
        <Route element={
            <div className="flex flex-col w-full h-full items-center">
                <Header stepnumber={0}></Header>
                <div className="flex flex-col w-[80%] h-full">
                    <Outlet/>
                </div>
            </div>
        }>

            <Route index element={
            <ModeButtons></ModeButtons>
            } />

            <Route path="/upload" element={
            <UploadMode file={file} setFile={setFile}></UploadMode>
            } />

            <Route path="/manual" element={
            <ManualMode></ManualMode>
            }/>
            
        </Route>
    </Routes>
    )
}

function ModeButtons(){
    const navigate = useNavigate()

    return(
                
        <div className="flex flex-row w-full h-[60%]">
            <div className="flex w-[50%] m-[2%]">
                <Button variant="contained" color="primary" sx={{textTransform:"none"}} onClick={()=>navigate("upload")}>
                    <div className="flex w-full h-full max-md:flex-col-reverse">
                        <div className="flex w-1/3 h-full justify-center items-center max-md:w-full">
                            <img src={UploadFileImg} className="max-w-[80%]"></img>
                        </div>
                        <div className="flex flex-col w-2/3 h-full items-start place-content-center max-md:w-full">
                            <Typography variant="h6" className="mb-2 font-black">
                                UPLOAD A FILE
                            </Typography>
                            <Typography variant="subtitle2" className="w-full max-h-[60%] text-left max-md:hidden line-clamp-6">
                                Generate a exercise starting from a 
                                reference. Upload a file containing your 
                                exercise. Automatically create a new 
                                one with same topic, vocabulary, goals. 
                            </Typography>
                        </div>
                    </div>
                </Button>
            </div>
            <div className="flex w-[50%] m-[2%]">
                <Button variant="contained" color="inherit" sx={{textTransform:"none"}} onClick={()=>navigate("manual")}>
                    <div className="flex w-full h-full max-md:flex-col-reverse">
                        <div className="flex w-1/3 h-full justify-center items-center max-md:w-full">
                            <img src={FillManuallyImg} className="max-w-[80%]"></img>
                        </div>
                        <div className="flex flex-col w-2/3 h-full items-start place-content-center max-md:w-full">
                            <Typography variant="h6" className="mb-2 font-black">
                                COMPILE MANUALLY                                   
                            </Typography>
                            <Typography variant="subtitle2" className="w-full max-h-[60%] text-left max-md:hidden line-clamp-6">
                                Generate a exercise compiling the given 
                                form. Fill all the required fields.
                                Create a new exercise choosing topic, 
                                vocabulary, goals. 
                            </Typography>
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    )
}

function UploadMode({file, setFile}){
    return(
        <>
        <FileUploader file={file} setFile={setFile}></FileUploader>
        {file && <GenerationForm></GenerationForm>}
        <div className="flex items-end justify-end w-full h-[15%]">
            <Button size="medium" variant="contained" endIcon={<NavigateNextIcon/>} disabled={!file}>Generate</Button>
        </div>
        </>
    )
}

function ManualMode(){
    return(
        <>
        <GenerationForm></GenerationForm>
        <div className="flex items-center justify-end w-full h-[15%]">
            <Button size="medium" variant="contained" endIcon={<NavigateNextIcon/>}>Generate</Button>
        </div>
        </>
    )
}

function GenerationForm(){

    const { formData, setFormData } = useFormData();

    const handleTextChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAutocompleteChange = (name) => (event, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };

    useEffect(()=>{
        console.log(formData)
    },[])

    return(
        <div className="flex flex-row w-full h-2/3 mt-2">
            <div className="flex flex-col w-1/2 h-full mr-6">
                <Typography variant="subtitle1" className="mb-1">Exercise Text</Typography>
                <TextField multiline label="Text" rows={11} className="w-full" 
                name="exercisetext" 
                onChange={handleTextChange} 
                value={formData.exercisetext || ""}>
                </TextField>
            </div>
            <div className="flex flex-col w-1/2 h-full ml-6">
                <div className="flex flex-col mb-2">
                <Typography variant="subtitle1" className="mb-1">Learning Goals</Typography>
                <Autocomplete multiple freeSolo
                name="goals"
                onChange={handleAutocompleteChange("goals")}
                value={formData.goals || []}
                options={[]}
                renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });
                        return (
                        <Chip variant="outlined" label={option} key={key} {...itemProps} />
                        );
                    })
                    } 
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Insert" placeholder="goal"/>
                )}></Autocomplete>
                </div>
                <div className="flex flex-col mb-2">
                <Typography variant="subtitle1" className="mb-1">Pre-Requisite</Typography>
                <Autocomplete multiple freeSolo
                name="prerequisites"
                onChange={handleAutocompleteChange("prerequisites")}
                value={formData.prerequisites || []}
                options={[]}
                renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });
                        return (
                        <Chip variant="outlined" label={option} key={key} {...itemProps} />
                        );
                    })
                    } 
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Insert" placeholder="pre-requisite"/>
                )}></Autocomplete>
                </div>
                <div className="flex flex-col">
                <Typography variant="subtitle1" className="mb-1">Features</Typography>
                
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={formData.reminder} onChange={handleCheckboxChange} name="reminder"/>} label="Reminder"></FormControlLabel>
                    <FormControlLabel control={<Checkbox checked={formData.example} onChange={handleCheckboxChange} name="example"/>} label="Worked Example"></FormControlLabel>
                </FormGroup>
                {/*<FormHelperText>Selected features will be added to the final exercise</FormHelperText>*/}
                
                </div>
            </div>
            
        </div>
    )
}

export {Generate}
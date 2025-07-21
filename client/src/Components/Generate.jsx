import { useEffect, useState } from "react"
import { Header } from "./Header"
import { FileUploader } from "./Uploader"
import Edit from "@mui/icons-material/Edit"
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Button, Divider, IconButton, Typography, TextField, Autocomplete, Chip,FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, LinearProgress, Tooltip } from "@mui/material"
import UploadFileImg from "../assets/uploadfile.png"
import FillManuallyImg from "../assets/fillmanually.png"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useFormData } from "../contexts/FormContext"
import API from "../API/API.mjs"
import { useDocument } from "../contexts/CustomizeContext"
import { Loading } from "./Loading"

function Generate(){
    const { formData, resetFormData } = useFormData();
    const { setTextBoxes} = useDocument()
    const [generating, setGenerating] = useState(false)

    const initialFieldError = {
        exercisetext: false,
        goals:false,
        prerequisites:false,
        school:false,
        grade:false
    }

    const [fieldError, setFieldError] = useState(initialFieldError) 

    const navigate = useNavigate()

    const checkErrorInputParams = () => {
        const newErrors = {
            exercisetext: !Boolean(formData.exercisetext),
            goals: !Boolean(formData.goals.length),
            prerequisites: !Boolean(formData.prerequisites.length),
            school: !Boolean(formData.school),
            grade: !Boolean(formData.grade)
        };

        setFieldError(newErrors);

        const values = Object.values(newErrors);
        const hasTrue = values.includes(true);

        return hasTrue;
    };

    const handleSubmit = async () =>{

        if (checkErrorInputParams()) {
            setTimeout(()=>{
                setFieldError(initialFieldError)
            },[4000])
            return
        }
        
        //resetFormData()

        try{
            setGenerating(true)
            const res = await API.handleExerciseGeneration(formData)
            setTextBoxes(res)
        }
        catch(err){
            console.log(err)
        }
        setGenerating(false)
        navigate("/customize")
    }

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
            <UploadMode handleSubmit={handleSubmit} generating={generating} fieldError={fieldError}></UploadMode>
            } />

            <Route path="/manual" element={
            <ManualMode handleSubmit={handleSubmit} generating={generating} fieldError={fieldError}></ManualMode>
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
                        <div className="flex flex-col w-2/3 h-full items-start place-content-center max-md:w-full max-md:items-center">
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
                        <div className="flex flex-col w-2/3 h-full items-start place-content-center max-md:w-full max-md:items-center">
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

function UploadMode({handleSubmit, generating, fieldError}){
    const [uploading, setUploading] = useState(false);
    const { formData, setFormData } = useFormData();

    return(
        <div className="flex flex-col w-full">
        <div>
        <FileUploader setUploading={setUploading}></FileUploader>
        </div>
        <div>
        {uploading? 
        <Loading text={"Extracting informations"}></Loading>
        : generating? <Loading text={"Generating exercise"}></Loading>
        : formData.file.url? <GenerationForm fieldError={fieldError}></GenerationForm> : null}
        </div>
        <div className="flex items-end justify-end w-full pb-4">
            <Button onClick={handleSubmit} size="medium" variant="contained" endIcon={<NavigateNextIcon/>} disabled={!formData.file.url || uploading || generating}>Generate</Button>
        </div>
        </div>
    )
}

function ManualMode({handleSubmit, generating, fieldError}){
    return(
        <div className="flex flex-col w-full">
        <div>
        {generating? <Loading text={"Generating exercise"}></Loading> : <GenerationForm fieldError={fieldError}></GenerationForm>}
        </div>
        <div className="flex items-center justify-end w-full pb-4">
            <Button onClick={handleSubmit} size="medium" variant="contained" endIcon={<NavigateNextIcon/>} disabled={generating}>Generate</Button>
        </div>
        </div>
    )
}

function GenerationForm({fieldError}){

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

    const handleSchoolChange = (name) => (event, value) => {
        setFormData(prev => prev.grade !== ""?  ({
            ...prev,
            [name]: value,
            grade: ""
        })
        : ({
            ...prev,
            [name]: value
        })
    );
    };

    const handleCheckboxChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };

    useEffect(()=>{
        console.log(fieldError)
    },[fieldError])

    return(
        <div className="flex flex-col w-full h-[80%] mt-2 md:flex-row">
            <div className="flex flex-col w-1/2 h-full mr-6 max-md:w-full max-md:pb-2">
                <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">Exercise Text</Typography>
                    <Tooltip title="The exercise text to take inspiration from" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                    </div>
                <TextField multiline label="Text" rows={14} className="w-full" 
                error={fieldError.exercisetext}
                name="exercisetext" 
                onChange={handleTextChange} 
                value={formData.exercisetext || ""}
                helperText={fieldError.exercisetext && "Mandatory field"}>
                </TextField>
            </div>
            <div className="flex flex-col w-1/2 h-full ml-6 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col mb-2">
                
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col w-[60%]">
                    <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">School</Typography>
                    <Tooltip title="The target school for the exercise" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                    </div>
                    <Autocomplete
                    fullWidth
                    name="school"
                    onChange={handleSchoolChange("school")}
                    value={formData.school}
                    options={["elementary","middle"]}
                    
                    renderInput={(params) => (
                        <TextField {...params} 
                        variant="outlined" 
                        label="Insert" 
                        placeholder="school" 
                        error={fieldError.school} 
                        helperText={fieldError.school && "Mandatory field"}/>
                    )}></Autocomplete>
                    </div>
                    <div className="flex-col w-[30%]">
                    <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">Grade</Typography>
                    <Tooltip title="School grade: 1-5 for elementary 1-3 for middle" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                    </div>
                    <Autocomplete
                    fullWidth
                    disabled={formData.school===""}
                    name="school"
                    onChange={handleAutocompleteChange("grade")}
                    value={formData.grade}
                    options={formData.school==="elementary"?
                        ["1","2","3","4","5"]:["1","2","3"]
                    }
                    
                    renderInput={(params) => (
                        <TextField {...params} 
                        variant="outlined" 
                        label="Insert" 
                        placeholder="grade" 
                        error={fieldError.grade}
                        helperText={fieldError.grade && "Mandatory field"}/>
                    )}></Autocomplete>
                    </div>
                </div>
                </div>
                <div className="flex flex-col mb-2">
                <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">Learning-Goals</Typography>
                    <Tooltip title="What the student is expected to learn from the new exercise" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                </div>
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
                    <TextField {...params} 
                    variant="outlined" 
                    label="Insert" 
                    placeholder="goal" 
                    error={fieldError.goals}
                    helperText={fieldError.goals && "Mandatory field"}/>
                )}></Autocomplete>
                </div>
                <div className="flex flex-col mb-2">
                <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">Pre-Requisites</Typography>
                    <Tooltip title="Skills or knowledge needed to do the new exercise" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                </div>
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
                    <TextField {...params} 
                    variant="outlined" 
                    label="Insert" 
                    placeholder="pre-requisite" 
                    error={fieldError.prerequisites}
                    helperText={fieldError.prerequisites && "Mandatory field"}/>
                )}></Autocomplete>
                </div>
                <div className="flex flex-col">
                <div className="flex flex-row items-center gap-1 mb-1">
                    <Typography variant="subtitle1" className="font-semibold">Features</Typography>
                    <Tooltip title="Choose to add a reminder concerning the pre-requites or a worked exercise example to help students" placement="right">
                        <InfoOutlineIcon fontSize="small"></InfoOutlineIcon>
                    </Tooltip>
                </div>
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
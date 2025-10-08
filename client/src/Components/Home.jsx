import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import imageCatAi from "../assets/illustazione-cat-ai.png"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import exportImg from "../assets/illustrazione-export.png"
import uploadImg from "../assets/illustrazione-upload.png"
import customizeImg from "../assets/illustrazione-customize.png"
import { useExportData } from '../contexts/ExportData';

function Home(){
    const {setExportData} = useExportData()

    const navigate = useNavigate()
    return (
        <div className='flex flex-col-reverse gap-1 w-full h-full justify-around lg:flex-row max-lg:justify-end max-lg:gap-3'>
            <div className='flex flex-col gap-4 items-start justify-center max-lg:mt-3 max-lg:items-center'>
            <Typography variant='h4' className='font-bold max-lg:hidden'>Create smarter classroom activities <br/>
                with your AI-teaching assistant</Typography>
            <Typography variant='body1' className='max-lg:text-center'>CAT-AI makes it easy for teachers to design exercises <br/> and quizzes tailored to their students and learning goals.
            <br/>  Whether you’re planning lessons or assessments, <br/> CAT-AI turns your ideas into ready-to-use activities.</Typography>
            <Steps></Steps>
            <Button variant='contained' size='large' onClick={() =>{ navigate("/generate"); setExportData((prev)=>({...prev, startTimeImport: Date.now()})) }} sx={{
                color: 'white',
                textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                backgroundImage: 'linear-gradient(135deg, #0097a7, #1565c0)',
                backgroundSize: '100% 100%',
                transition: 'background-image 0.3s ease, transform 0.2s ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    backgroundImage: 'linear-gradient(135deg, #006978, #0d47a1)', // ancora più scuro in hover
                },
                '&.Mui-selected': {
                    transform: 'scale(0.98)',
                    backgroundImage: 'linear-gradient(135deg, #26c6da, #1e88e5)', // selected più chiaro
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    '&:hover': {
                        backgroundImage: 'linear-gradient(135deg, #0097a7, #1565c0)',
                    },
                },
            }}>
                START GENERATING
            </Button>

            </div>
            <div className='flex flex-col justify-center max-lg:h-[30%]'>
                <div className='flex flex-row gap-3 relative rounded-md' style={{backgroundImage: "linear-gradient(135deg, #0097a7, #1565c0)"}}>
                    <img src={imageCatAi} className='flex object-contain rounded-md translate-x-4 translate-y-4 max-h-80 max-lg:max-h-36'></img>
                    <Typography variant='h4' className='h-full font-bold text-white text-center content-center mb-[5%] p-2 lg:hidden'>Your personal AI teaching assistant</Typography>
                </div>
                
            </div>
        </div>
    )
}

function Steps(){
    return (
        <div className='flex flex-row w-full justify-center items-center gap-3'>
            <div className='flex flex-col gap-1 items-center text-center'>
            <Typography className='font-bold'>Upload and Generate</Typography>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 max-md:h-28 max-md:w-28' style={{backgroundImage: "linear-gradient(135deg, #0097a7, #1565c0)"}}>
                <img src={uploadImg} className='object-contin'></img>
            </div>
            </div>
            <ArrowRightIcon></ArrowRightIcon>
            <div className='flex flex-col gap-1 items-center text-center'>
            <Typography className='font-bold'>Customize and Export</Typography>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 max-md:h-28 max-md:w-28' style={{backgroundImage: "linear-gradient(135deg, #0097a7, #1565c0)"}}>
                <img src={customizeImg} className='object-contin'></img>
            </div>
            </div>
            <ArrowRightIcon></ArrowRightIcon>
            <div className='flex flex-col gap-1 items-center text-center'>
            <Typography className='font-bold'>Download and Repeat</Typography>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 max-md:h-28 max-md:w-28' style={{backgroundImage: "linear-gradient(135deg, #0097a7, #1565c0)"}}>
                <img src={exportImg} className='object-contin'></img>
            </div>
            </div>
        </div>
    )
}

export {Home}
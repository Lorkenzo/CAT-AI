import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import imageCatAi from "../assets/illustazione-cat-ai.png"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function Home(){
    const navigate = useNavigate()
    return (
        <div className='flex flex-col-reverse w-full h-full justify-around md:flex-row max-md:justify-end max-md:gap-3'>
            <div className='flex flex-col items-start justify-center max-md:mt-3 max-md:items-center'>
            <Typography variant='h4' className='font-bold mb-[5%] max-md:hidden'>Create smarter classroom activities <br/>
                with your AI-teaching assistant</Typography>
            <Typography variant='body1' className='max-md:text-center mb-[5%]'>CAT-AI makes it easy for teachers to design exercises <br/> and quizzes tailored to their students and learning goals.
            <br/>  Whether you’re planning lessons or assessments, <br/> CAT-AI turns your ideas into ready-to-use activities in no time.</Typography>
            <Button variant='contained' onClick={()=>navigate("/generate")}>START GENERATING</Button>
            </div>
            <div className='flex flex-col justify-center max-md:h-[30%]'>
                <div className='flex flex-row gap-3 relative rounded-md bg-[#1565c0]'>
                    <img src={imageCatAi} className='flex object-contain rounded-md translate-x-4 translate-y-4 max-h-80 max-md:max-h-36'></img>
                    <Typography variant='h4' className='h-full font-bold text-white text-center content-center mb-[5%] p-2 md:hidden'>Your personal AI teaching assistant</Typography>
                </div>
                
            </div>
        </div>
    )
}

function Steps(){
    return (
        <div className='flex flex-row justify-center items-center gap-3 md:hidden'>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 bg-[#1565c0]'>
                <div>Generate from file or informations</div>
            </div>
            <ArrowRightIcon></ArrowRightIcon>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 bg-[#1565c0]'>
                <div>Customize new exercise</div>
            </div>
            <ArrowRightIcon></ArrowRightIcon>
            <div className='flex flex-col text-white font-bold text-center h-40 w-40 rounded-md p-2 bg-[#1565c0]'>
                <div>Download and go</div>
            </div>
        </div>
    )
}

export {Home}
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate()
    return (
        <div className='flex flex-row w-full h-full'>
            <div className='w-[60%] h-full content-center'>
            <Typography variant='h4' className='font-bold mb-[5%]'>Create smarter classroom activities <br/>
                with your AI-teaching assistant</Typography>
            <Typography variant='body1' className='mb-[5%]'>CAT-AI makes it easy for teachers to design exercises <br/> and quizzes tailored to their students and learning goals.
            <br/>  Whether you’re planning lessons or assessments, <br/> CAT-AI turns your ideas into ready-to-use activities in no time.</Typography>
            <Button variant='contained' onClick={()=>navigate("/generate")}>START GENERATING</Button>
            </div>
            <div className='w-[40%] h-full content-center'>
            <img src='src\assets\CATAI.png'></img>
            </div>
        </div>
    )
}

export {Home}
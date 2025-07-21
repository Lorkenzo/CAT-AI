import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate()
    return (
        <div className='flex flex-col-reverse w-full h-full justify-around md:flex-row max-md:justify-end'>
            <div className='flex flex-col items-start justify-center'>
            <Typography variant='h4' className='font-bold mb-[5%]'>Create smarter classroom activities <br/>
                with your AI-teaching assistant</Typography>
            <Typography variant='body1' className='mb-[5%]'>CAT-AI makes it easy for teachers to design exercises <br/> and quizzes tailored to their students and learning goals.
            <br/>  Whether you’re planning lessons or assessments, <br/> CAT-AI turns your ideas into ready-to-use activities in no time.</Typography>
            <Button variant='contained' onClick={()=>navigate("/generate")}>START GENERATING</Button>
            </div>
            <div className='flex flex-col justify-center max-md:h-[30%]'>
                <img src='src/assets/CATAI.png' className='object-contain max-md:max-h-40'></img>
            </div>
        </div>
    )
}

export {Home}
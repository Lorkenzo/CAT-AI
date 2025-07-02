import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';

function Header({stepnumber}){

    let steps = [
    'Generate',
    'Customize',
    'Export',
    ];

    const stepsmap = {
    0: 'Generate',
    1: 'Customize',
    2: 'Export',
    3: 'Export'
    };

    const stepscaptionmap = {
    0: 'Load your exercise file or fill manually using the manual editor',
    1: 'Custom easily your generated exercise using toolbars',
    2: 'Save your favorite exercise format as pdf or h5p',
    3: 'Save other formats or generate again'
    };

    return(
        <div className="w-full h-[27%] justify-items-center">
            <div className="w-[40%] h-full pt-2">
                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                    <Link underline="hover" color="inherit" href="/" variant='body2'>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit"/>
                        Home
                    </Link>

                    {
                        ...steps.filter((e,i)=>i<stepnumber && i!=2).map((e,i)=>
                            <Link underline="hover" color="inherit" href={`/${stepsmap[i].toLowerCase()}`} variant='body2'>{e}</Link>
                        )
                    }
                    <Typography key="3" sx={{ color: 'text.primary' }} variant='body2'>
                        {stepsmap[stepnumber]} 
                    </Typography>
                </Breadcrumbs>

                <Typography variant='h5' className='pt-2'>
                    {stepsmap[stepnumber]} Exercise
                </Typography>

                <Typography variant='subtitle2' className='pt-2'>
                    {stepscaptionmap[stepnumber]} 
                </Typography>

                <Divider className='pt-2'/>
                
                <div className='w-full pt-3'>
                    <Stepper activeStep={stepnumber}>
                        {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
            
        </div>
    )
}

export {Header}
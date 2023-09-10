import { useEffect, useState } from 'react';
import './Vacancies.styles.scss'
import Vacancy from './Vacancy/Vacancy.component';
import JobApi from '@/app/api/job/Job.api';
import VacancyModal from './Vacancy/VacancyModal/VacancyModal.component';

const Vacancies = () => {
    const [jobs, setJobs] = useState<Job[]>([]); 
    
    useEffect(
        ()=> { 
            JobApi.getActive()
                .then(
                    result => {
                        setJobs(result);
                    }
                ) 
                .catch(
                    (e)=> {
                        console.log(e);
                    }
                )  
        },[]
    );

    return (
        jobs.length ? 
            <div className='aboutUsBlockContainer'>
                <h1><div /><span>Вакансії</span><div /></h1>
                <div className='vacanciesBlock'>
                    <div className='textBlock'>
                        <h2>Приєднуйся до команди найактивніших стріткодерів, небайдужих до власної історії</h2>
                        <h3>Твоє его фахівця поєдналося з его громадського активіста і не дає спати? Ти розділяєш наше прагнення заповнити прогалини історичної пам'яті українців через пізнавальний контент у міських просторах? Тоді тобі до нас! Приєднуйся — попрацюємо на зміни разом.</h3>
                        </div>
                            {jobs.map((job)=>(<Vacancy key={job.id} {...job}/>))}
                        </div>
                </div>
         : <></>
    )
};

export default Vacancies;
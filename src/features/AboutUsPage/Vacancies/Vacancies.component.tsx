import './Vacancies.styles.scss';

import React, { useEffect, useState } from 'react';

import JobApi from '@/app/api/job/Job.api';

import Vacancy from './Vacancy/Vacancy.component';

const Vacancies = ({ setHasVacancies } : { setHasVacancies: (hasVacancies: boolean) => void }) => {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        JobApi.getActive()
            .then(
                (result) => {
                    setJobs(result);
                    setHasVacancies(result.length > 0);
                },
            )
            .catch(
                (e) => {
                    console.log(e);
                },
            );
    }, []);
    return (
        jobs.length
            ? (
                <div className="aboutUsBlockContainer">
                    <h1>
                        <div />
                        <span>Вакансії</span>
                        <div />
                    </h1>
                    <div id="vacancies" className="vacanciesBlock">
                        <div className="textBlock">
                            <h2>Приєднуйся до команди найактивніших стріткодерів, небайдужих до власної історії</h2>
                            <h3>
                                Твоє его фахівця поєдналося з его громадського активіста і не дає спати?
                                Ти розділяєш наше прагнення заповнити прогалини історичної пам'яті українців
                                через пізнавальний контент у міських просторах? Тоді тобі до нас!
                                Приєднуйся — попрацюємо на зміни разом.
                            </h3>
                        </div>
                        {jobs.map((job) => (<Vacancy key={job.id} {...job} />))}
                    </div>
                </div>
            )
            : <></>
    );
};

export default Vacancies;

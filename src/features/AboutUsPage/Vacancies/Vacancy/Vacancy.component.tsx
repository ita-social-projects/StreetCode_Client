import './Vacancy.syles.scss';

import React, { useState } from 'react';

import VacancyModal from './VacancyModal/VacancyModal.component';

const Vacancy = (job: Job) => {
    const maxLength = 260;
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const ChangeStatus = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div className='vacancyContainer'>
            <h2>{job?.title}</h2>
            <h3>{job?.salary}</h3>
            {
                job?.description.length < maxLength
                    ? <p><div dangerouslySetInnerHTML={{ __html: job?.description }} />
                        <label
                            onClick={ () => {setIsModalOpen(true)}}> Трохи ще
                        </label>
                    </p>
                    : <p><div dangerouslySetInnerHTML={{ __html: `${job?.description.substring(0, maxLength).split(' ').slice(0, -1).join(' ')}...` }} />
                        <label
                            onClick={ () => {setIsModalOpen(true)}}>
                                Трохи ще
                        </label>
                    </p>
            }
            <VacancyModal isOpen={isModalOpen} setOpen={ChangeStatus} job = {job}/>
        </div>
    );
};

export default Vacancy;

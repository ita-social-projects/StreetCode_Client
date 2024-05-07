/* eslint-disable react/destructuring-assignment */
import './Vacancy.syles.scss';

import React, { useState } from 'react';
import CardText from '@components/CardText/CardText.component';
import htmlReactParser from 'html-react-parser';

import VacancyModal from './VacancyModal/VacancyModal.component';

const Vacancy = (job: Job) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <div className="vacancyContainer">
            <CardText
                onBtnClick={() => setIsModalOpen(true)}
                title={job.title}
                text={job.description}
                subTitle={job.salary}
                moreBtnText="Трохи ще"
            />
            <VacancyModal isOpen={isModalOpen} setOpen={setIsModalOpen} job={job} />
        </div>
    );
};

export default Vacancy;

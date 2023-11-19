/* eslint-disable react/destructuring-assignment */
import './Vacancy.syles.scss';

import React, { useState } from 'react';
import CardText from '@components/CardText/CardText.component';

import VacancyModal from './VacancyModal/VacancyModal.component';
import htmlReactParser from 'html-react-parser';

const Vacancy = (job: Job) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const ChangeStatus = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div className="vacancyContainer">
            <CardText
                onBtnClick={() => setIsModalOpen(true)}
                title={job.title}
                text={htmlReactParser(job.description)}
                subTitle={job.salary}
                moreBtnText="Трохи ще"
            />
            <VacancyModal isOpen={isModalOpen} setOpen={ChangeStatus} job={job} />
        </div>
    );
};

export default Vacancy;

/* eslint-disable react/destructuring-assignment */
import './Vacancy.syles.scss';

import React, { useState } from 'react';
import CardText from '@components/CardText/CardText.component';
import htmlReactParser from 'html-react-parser';

import VacancyModal from './VacancyModal/VacancyModal.component';

const Vacancy = (job: Job) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const tempElement = document.createElement('div');
    tempElement.innerHTML = job.description;

    const strongElements = tempElement.querySelectorAll('strong');

    strongElements.forEach((strongElement) => {
        const parent = strongElement.parentNode as ParentNode;
        while (strongElement.firstChild) {
            parent.insertBefore(strongElement.firstChild, strongElement);
        }
        parent.removeChild(strongElement);
    });

    const cleanText = tempElement.innerHTML;
    return (
        <div className="vacancyContainer">
            <CardText
                onBtnClick={() => setIsModalOpen(true)}
                title={job.title}
                text={htmlReactParser(cleanText?.substring(0, 2000)) as string}
                subTitle={job.salary}
                moreBtnText="Трохи ще"
            />
            <VacancyModal isOpen={isModalOpen} setOpen={setIsModalOpen} job={job} />
        </div>
    );
};

export default Vacancy;

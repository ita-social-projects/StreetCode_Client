import './VacancyModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import React from 'react';
import { EMAIL_INFO } from '@constants/email.constants';

import { Button, Modal } from 'antd';

import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';

interface Props {
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    job : Job
}

const VacancyModal = ({ isOpen, setOpen, job }: Props) => {
    const descriptionLines = job.description.split('\n').map((line, index) => (
        <>
            <div dangerouslySetInnerHTML={{ __html: line }} />
            <br />
        </>
    ));

    const getWidth = () => {
        if (window.innerWidth > SCREEN_SIZES.tablet) {
            return 830;
        }
        if (window.innerWidth > SCREEN_SIZES.smallTablet) {
            return 600;
        }
        if (window.innerWidth > SCREEN_SIZES.phone) {
            return 400;
        }
        if (window.innerWidth > SCREEN_SIZES.smallPhone) {
            return 310;
        }
        return 270;
    };

    return (
        <Modal
            open={isOpen}
            onCancel={() => {
                setOpen(false);
            }}
            closeIcon={<CancelBtn />}
            className="vacancyModal"
            footer={null}
            width={getWidth()}
        >
            <div className="vacancyModalContainer">
                <div className="textContainer">
                    <h2>{job.title}</h2>
                    <h3>{job.salary}</h3>
                    <p>{descriptionLines}</p>
                </div>
                <div className="buttonContainer">
                    <Button
                        className="vacancyModalButton streetcode-custom-button"
                        onClick={() => {
                            window.open(EMAIL_INFO.WRITE_EMAIL_TO_US, '_blank');
                        }}
                    >
                        Відгукнутися
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
export default VacancyModal;

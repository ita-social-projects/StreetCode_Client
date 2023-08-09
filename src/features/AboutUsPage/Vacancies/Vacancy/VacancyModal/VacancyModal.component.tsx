import './VacancyModal.styles.scss';
import { Button, Modal } from "antd";
import CancelBtn from '@images/utils/Cancel_btn.svg';
import React from 'react';
import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';


interface Props {
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    job : Job
}

const VacancyModal = ({isOpen, setOpen, job}: Props) => {

    const descriptionLines = job.description.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    const getWidth = () => {
        if(window.innerWidth > SCREEN_SIZES.tablet) {
            return 830
        }
        if(window.innerWidth > SCREEN_SIZES.smallTablet){
            return 600
        }
        if(window.innerWidth > SCREEN_SIZES.smallPhone){
            return 450
        }
            return 270
    }

   return(
        <Modal
            open = {isOpen}
            onCancel={ ()=>{setOpen(false)}}
            closeIcon={<CancelBtn />}
            className="vacancyModal"
            footer = {null}
            width={getWidth()}
            >
                
                <div className='vacancyModalContainer'>
                    <div className='textContainer'>
                        <h2>{job.title}</h2>
                        <h3>{job.salary}</h3>
                        <p>{descriptionLines}</p>
                    </div>
                    <div className='buttonContainer'>
                        <Button className='vacancyModalButton streetcode-custom-button'>Відгукнутися</Button>
                    </div>
                </div>
        </Modal>
   );
}
export default VacancyModal;
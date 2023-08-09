import './VacancyModal.styles.scss';
import { Button, Modal } from "antd";
import CancelBtn from '@images/utils/Cancel_btn.svg';


interface Props {
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    job : Job
}

const VacancyModal = ({isOpen, setOpen, job}: Props) => {
   return(
        <Modal
            open = {isOpen}
            onCancel={ ()=>{setOpen(false)}}
            closeIcon={<CancelBtn />}
            className="vacancyModal"
            footer = {null}
            >
                <div className='vacancyModalContainer'>
                    <div className='textContainer'>
                        <h2>{job.title}</h2>
                        <h3>{job.salary}</h3>
                        <p>{job.description}</p>
                    </div>
                    <div className='buttonContainer'>
                        <Button className='vacancyModalButton streetcode-custom-button'>Відгукнутися</Button>
                    </div>
                </div>
        </Modal>
   );
}
export default VacancyModal;
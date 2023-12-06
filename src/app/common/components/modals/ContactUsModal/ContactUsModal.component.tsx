import ContactForm from '@/app/common/components/ContactForm/ContactForm.component'
import './ContactUsModal.styles.scss'
import { Form, Modal, Popover, Typography } from 'antd'
const { Text } = Typography
import { useRef, useState } from 'react';
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { useMediaQuery } from 'react-responsive';

interface Props {
    text: string;
    toggleState: () => void | undefined;
}

export const ContactUsModal = ({ text, toggleState}: Props) => {

    const [isActive, setActive] = useState(false);
    const form = useRef(null);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });
    
    const handleClick = () => {
        setActive(true);
        toggleState();
    };

    const onClear = () => {
        if(form.current !== undefined || form.current !== null){
            form.current?.clearModal();
        }
    };
    return (
        <>
            <Text onClick={() => handleClick()} className='text-white'>{text}</Text>
            <Modal
                className="contactUsModal"
                open={isActive}
                footer={null}
                onCancel={() => setActive(false)}
                width={"max-content"}
                closeIcon={(isDesktop ? 
                    <Popover content="Внесені зміни не будуть збережені!" trigger='hover'>
                        <CancelBtn onClick={onClear} />
                    </Popover>
                    : <CancelBtn onClick={onClear} />)}
            >
                <ContactForm customClass={"formWrapper__modal"} ref={form} />
            </Modal>
        </>
    )
}
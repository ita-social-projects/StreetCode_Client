import ContactForm from '@/app/common/components/ContactForm/ContactForm.component'
import './ContactUsModal.styles.scss'
import { Form, Modal, Popover, Typography } from 'antd'
const { Text } = Typography
import { useEffect, useState } from 'react';
import CancelBtn from '@images/utils/Cancel_btn.svg';

interface Props {
    text: string;
    toggleState: () => void | undefined;
}

export const ContactUsModal = ({ text, toggleState }: Props) => {
    const [isActive, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        toggleState();
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
                closeIcon={<CancelBtn />}
            >
                <ContactForm customClass={"formWrapper__modal"} />
            </Modal>
        </>
    )
}
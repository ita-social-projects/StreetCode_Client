import ContactForm from '@/app/common/components/ContactForm/ContactForm.component'
import './ContactUsModal.styles.scss'
import { Modal, Typography } from 'antd'
const { Text } = Typography
import { useEffect, useState } from 'react';

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
            <Modal open={isActive} footer={null} onCancel={() => setActive(false)} width={"max-content"}>
                <ContactForm customClass={"formWrapper__modal"} />
            </Modal>
        </>
    )
}
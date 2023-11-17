import ContactForm from '@/app/common/components/ContactForm/ContactForm.component'
import './ContactUsModal.styles.scss'
import { Form, Modal, Popover, Typography } from 'antd'
const { Text } = Typography
import { useRef, useState } from 'react';
import CancelBtn from '@images/utils/Cancel_btn.svg';

interface Props {
    text: string;
    toggleState: () => void | undefined;
}

export const ContactUsModal = ({ text, toggleState}: Props) => {

    const [isActive, setActive] = useState(false);
    const form = useRef(null);

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
                closeIcon={<Popover content="Внесені зміни не будуть збережені!" trigger='hover'><CancelBtn className='iconSize' onClick={onClear} />
                </Popover>}
            >
                <Form>
                <ContactForm customClass={"formWrapper__modal"} ref={form} />
                </Form>
            </Modal>
        </>
    )
}
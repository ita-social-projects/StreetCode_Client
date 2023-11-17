import ContactForm from '@/app/common/components/ContactForm/ContactForm.component'
import './ContactUsModal.styles.scss'
import { Form, Modal, Popover, Typography } from 'antd'
const { Text } = Typography
import { useEffect, useState } from 'react';
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { fromUnixTime } from 'date-fns/esm';
import Email from '@/models/email/email.model';

interface Props {
    text: string;
    toggleState: () => void | undefined;
    modalClearState: () => void | undefined;
}

export const ContactUsModal = ({ text, toggleState, modalClearState}: Props) => {
    const [form] = Form.useForm();
    const [isActive, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        toggleState();
    };

    const onClear = () => {
        modalClearState();
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
                <Form form = {form}>
                <ContactForm customClass={"formWrapper__modal"} />
                </Form>
            </Modal>
        </>
    )
}
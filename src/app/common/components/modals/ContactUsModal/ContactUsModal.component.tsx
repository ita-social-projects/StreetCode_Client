import './ContactUsModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Form, Modal, Popover, Typography } from 'antd';

import ContactForm from '@/app/common/components/ContactForm/ContactForm.component';

const { Text } = Typography;

interface Props {
    text: string;
    toggleState: () => void | undefined;
}

export const ContactUsModal = ({ text, toggleState }: Props) => {
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
        if (form.current !== undefined || form.current !== null) {
            form.current?.clearModal();
        }
    };
    return (
        <>
            <Text onClick={() => handleClick()} className="text-white">{text}</Text>
            <Modal
                className="contactUsModal"
                open={isActive}
                footer={null}
                onCancel={() => {
                    setActive(false);
                    onClear();
                }}
                width="max-content"
                closable={isDesktop}
                closeIcon={(isDesktop
                    ? (
                        <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                            <CancelBtn />
                        </Popover>
                    )
                    : <CancelBtn />)}
            >
                <ContactForm customClass="formWrapper__modal" ref={form} />
            </Modal>
        </>
    );
};

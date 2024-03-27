import './PartnersModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import useMobx, { useModalContext } from '@stores/root-store';

import {
    Button, Form, Input, message, Modal, Popover,
} from 'antd';

import EmailApi from '@/app/api/email/email.api';
import { partnersClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import Email from '@/models/email/email.model';
import { ERROR_MESSAGES } from '@/app/common/constants/error-messages.constants';

const MAX_SYMBOLS = 500;

const PartnersModal = () => {
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { partners } } = modalStore;
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { MESSAGE_LIMIT, SOMETHING_IS_WRONG, RECAPTCHA_CHECK } = ERROR_MESSAGES;

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFinish = () => {
        if (isVerified) {
            const token = recaptchaRef?.current?.getValue();
            const newEmail: Email = { from: formData.email, content: formData.message, token: token };
            EmailApi.send(newEmail)
                .then(() => {
                    onCancel();
                    successMessage();
                })
                .catch((error) => {
                    onCancel();
                    if (error === 429) {
                        errorMessage(MESSAGE_LIMIT);
                    }
                    else {
                        errorMessage(SOMETHING_IS_WRONG);
                    }
                });
            recaptchaRef.current?.reset();
            setIsVerified(false);
        }
        else {
            errorMessage(RECAPTCHA_CHECK);
        }
    };

    const onClear = () => {
        partners.isOpen = false;
        form.resetFields();
    };

    const onCancel = () => {
        partners.isOpen = false;
        form.resetFields();
    };

    const handleVerify = () => {
        setIsVerified(true);
    };

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Лист успішно надісланий',
        });
        form.resetFields();
    };

    const errorMessage = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    useEffect(() => {
        const handleRouteChange = () => {
            if (partners.isOpen) {
                onCancel();
                window.history.replaceState(null, '');
            }
        };

        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [partners.isOpen]);

    return (
        <Modal
            className="partnersModal"
            open={partners.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={onCancel}
            closeIcon={(
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                    <CancelBtn className="iconSize" onClick={onClear} />
                </Popover>
            )}
        >
            {messageContextHolder}
            <div className="partnersModalContent">
                <div className="formContainer">
                    <div className="formTitle">
                        Напиши нам! Вкажи контактну особу, опиши, якими бачиш варіанти співпраці.
                        <br />
                        Ми відкриті до найсміливіших пропозицій та найкреативніших ідей!
                    </div>
                    <Form
                        form={form}
                        className="contactForm"
                        onFinish={onFinish}
                        validateMessages={{}}
                    >
                        <Form.Item
                            className="textareaBlock required-input"
                            name="message"
                            rules={[{
                                required: true,
                                min: 1,
                                max: MAX_SYMBOLS,
                                message: 'Будь ласка, вкажи свою пропозицію',
                            }]}
                        >
                            <Input.TextArea
                                className="textarea"
                                name="message"
                                showCount
                                autoSize={{ minRows: 4, maxRows: 4 }}
                                // eslint-disable-next-line max-len
                                placeholder="Твоя пропозиція або ідея – можливо, просто зараз ми чекаємо саме на неї! ;)"
                                maxLength={MAX_SYMBOLS}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            className="required-input"
                            rules={[
                                {
                                    required: true,
                                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'E-mail може містити лише маленькі латинські літери, цифри і символи @._-',
                                },
                            ]}
                        >
                            <Input
                                className="input"
                                name="email"
                                placeholder="Твій e-mail"
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <div className="captchaBlock ">
                            <ReCAPTCHA
                                className="required-input"
                                sitekey={siteKey ? siteKey : ""}
                                onChange={handleVerify}
                                ref={recaptchaRef}
                            />
                        </div>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={() => partnersClickEvent()}>
                                Відправити
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default observer(PartnersModal);

import './ContactForm.styles.scss';

import { LegacyRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { Button, Form, Input, message } from 'antd';

import EmailApi from '@/app/api/email/email.api';
import Email from '@/models/email/email.model';
import { ERROR_MESSAGES } from '../../constants/error-messages.constants';

const MAX_SYMBOLS = 500;

interface Props {
    customClass: string;
}

const ContactForm = forwardRef((customClass: Props, ref) => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [isVerified, setIsVerified] = useState(false);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { MESSAGE_LIMIT, SOMETHING_IS_WRONG, RECAPTCHA_CHECK } = ERROR_MESSAGES;

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleVerify = () => {
        setIsVerified(true);
    };

    useImperativeHandle(ref, () => ({
        clearModal() {
            form.resetFields();
        },
    }));

    const onFinish = () => {
        if (isVerified) {
            const token = recaptchaRef?.current?.getValue();
            const newEmail: Email = { from: formData.email, content: formData.message, token: token };
            EmailApi.send(newEmail)
                .then(() => {
                    successMessage();
                })
                .catch((error) => {
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

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Лист успішно надісланий',
        });
    };

    const errorMessage = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    return (
        <div className={`formWrapper ${customClass}`}>
            {messageContextHolder}
            <div className="formTitleContainer">
                <div className="formTitle">Форма зворотного зв’язку</div>
                <div className="formSubTitle">
                    Твої ідеї, думки чи коментар можуть стати початком
                    чогось значного! Вйо до листування!
                </div>
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
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        placeholder="Наші серця, очі та вуха відкриті до твоїх креативних повідомлень!"
                        maxLength={MAX_SYMBOLS}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Form.Item
                    className="required-input"
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
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
                <div className="captchaBlock">
                    <ReCAPTCHA
                        className="required-captcha"
                        sitekey={siteKey ? siteKey : ""}
                        onChange={handleVerify}
                        ref={recaptchaRef}
                    />
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Відправити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});

export default ContactForm;

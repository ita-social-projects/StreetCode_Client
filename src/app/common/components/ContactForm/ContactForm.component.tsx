import './ContactForm.styles.scss';

import { forwardRef, useState, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { Button, Form, Input, message } from 'antd';

import EmailApi from '@/app/api/email/email.api';
import Email from '@/models/email/email.model';

const MAX_SYMBOLS = 500;

interface Props {
    customClass: string;
}

const ContactForm = forwardRef((customClass: Props , ref) => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [isVerified, setIsVerified] = useState(false);
    const messageLength = formData.message.length | 0;
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleVerify = () => {
        setIsVerified(true);
    };

    useImperativeHandle(ref, () => ({
     clearModal(){
        form.resetFields();
    }
    }));

    const onFinish = () => {
        if (isVerified) {
            const newEmail: Email = { from: formData.email, content: formData.message };
            EmailApi.send(newEmail)
                .then(successMessage)
                .catch(errorMessage);
        }
    };
    
    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Лист успішно надісланий',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Щось пішло не так...',
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
            <Form form={form}
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
                    <p className="custom-character-counter">
                        {messageLength}
                        /
                        {' '}
                        {MAX_SYMBOLS}
                    </p>
                </Form.Item>
                <Form.Item
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
                <div className="captchaBlock ">
                    <ReCAPTCHA
                        className="required-input"
                        sitekey="6Lf0te8mAAAAAN47cZDXrIUk0kjdoCQO9Jl0DtI4"
                        onChange={handleVerify}
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

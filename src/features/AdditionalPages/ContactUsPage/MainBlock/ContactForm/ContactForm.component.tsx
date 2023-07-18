import './ContactForm.styles.scss';

import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { Button, Form, Input } from 'antd';

import EmailApi from '@/app/api/email/email.api';
import Email from '@/models/email/email.model';

const MAX_SYMBOLS = 500;

const ContactForm = () => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [isVerified, setIsVerified] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleVerify = () => {
        setIsVerified(true);
    };

    const onFinish = () => {
        if (isVerified) {
            const newEmail: Email = { from: formData.email, content: formData.message };
            EmailApi.send(newEmail);
        }
    };

    return (
        <div className="formContainer">
            <div className="formTitleContainer">
                <div className="formTitle">Форма зворотного зв’язку</div>
                <div className="formSubTitle">
                    Твої ідеї, думки чи коментар можуть стати початком
                    чогось значного! Вйо до листування!
                </div>
            </div>
            <Form
                className="contactForm"
                onFinish={onFinish}
                validateMessages={{}}
            >
                <Form.Item
                    className="textareaBlock required-input"
                    name="message"
                    rules={[{ required: true,
                              min: 1,
                              max: MAX_SYMBOLS }]}
                >
                    <Input.TextArea
                        className="textarea"
                        name="message"
                        showCount
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        placeholder="Наші серця, очі та вуха відкриті до твоїх креативних повідомлень!"
                        maxLength={MAX_SYMBOLS}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: false,
                          type: 'email' },
                    ]}
                >
                    <Input
                        className="input"
                        name="email"
                        placeholder="Твій e—mail"
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
};

export default ContactForm;

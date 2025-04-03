import './ContactForm.styles.scss';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ERROR_MESSAGES } from '@constants/error-messages.constants';

import { Button, Form, Input, message } from 'antd';

import EmailApi from '@/app/api/email/email.api';
import Email from '@/models/email/email.model';

const MAX_SYMBOLS = 500;

interface Props {
    customClass?: string;
}

const ContactForm = forwardRef((customClass: Props, ref) => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const { MESSAGE_LIMIT } = ERROR_MESSAGES;
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useImperativeHandle(ref, () => ({
        clearModal() {
            form.resetFields();
        },
    }));

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Лист успішно надісланий',
        });
    };

    const errorMessage = (error: string) => {
        messageApi.open({
            type: 'error',
            content: error,
        });
    };

    const onFinish = async (values: { email: string; message: string }) => {
        if (!executeRecaptcha) {
            return;
        }
        const token = await executeRecaptcha('feedback');
        const newEmail: Email = {
            from: values.email,
            source: 'сторінка Контакти',
            content: values.message,
            token,
        };
        EmailApi.send(newEmail)
            .then(() => {
                successMessage();
            })
            .catch((error) => {
                if (error.status === 429) {
                    errorMessage(MESSAGE_LIMIT);
                } else {
                    for (const key in error.data) {
                        errorMessage(`${error.data[key].message}`);
                    }
                }
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
                        showCount
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

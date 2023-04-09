import './AdminLogin.style.scss';

import React from 'react';

import { Button, Form, Input } from 'antd';

const AdminLogin:React.FC = () => {
    const [form] = Form.useForm();

    return (
        <Form form={form} className="admin-login-form">
            <Form.Item label="Логін" rules={[{ required: true, message: 'Введіть логін' }]}>
                <Input maxLength={20} />
            </Form.Item>

            <Form.Item label="Пароль" rules={[{ required: true, message: 'Введіть пароль' }]}>
                <Input maxLength={20} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" className="streetcode-custom-button">
                    Увійти
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AdminLogin;

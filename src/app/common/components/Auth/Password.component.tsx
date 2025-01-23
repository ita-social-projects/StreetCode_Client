import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';

import { Form, Input } from 'antd';

const Password = () => {
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleInputPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleInputPasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(event.target.value);
    };

    return (
        <>
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="password"
                rules={[{ required: true, message: 'Введіть пароль' }]}
            >
                <Input.Password
                    value={password}
                    onChange={handleInputPasswordChange}
                    placeholder="Пароль"
                    className="registerInputField"
                />
            </Form.Item>
            <PasswordChecklist
                rules={['minLength', 'number', 'capital', 'lowercase', 'specialChar', 'match']}
                minLength={8}
                value={password}
                valueAgain={passwordRepeat}
                messages={{
                    minLength: 'Мінімальна довжина пароля — 8 символів',
                    number: 'Пароль повинен містити принаймні одну цифру',
                    capital: 'Пароль повинен містити принаймні одну ВЕЛИКУ літеру',
                    lowercase: 'Пароль повинен містити принаймні одну маленьку літеру',
                    specialChar: 'Пароль повинен містити принаймні один неалфавітно-цифровий символ',
                    match: 'Пароль співпадає',
                }}
            />
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="passwordConfirmation"
                rules={[
                    {
                        required: true, message: 'Введіть пароль підтведження',
                    },
                ]}
            >
                <Input.Password
                    value={passwordRepeat}
                    onChange={handleInputPasswordRepeatChange}
                    placeholder="Повторіть пароль"
                    className="registerInputField"
                />
            </Form.Item>
        </>
    );
};

export default Password;

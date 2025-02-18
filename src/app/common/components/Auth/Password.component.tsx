import './Password.styles.scss';

import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';
import validatePatternPassword from '@utils/userValidators/validatePassword';

import { Form, Input } from 'antd';

interface Props {
    onPasswordValid: (field: boolean) => void;
}

const Password = ({ onPasswordValid } : Props) => {
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleInputPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleInputPasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(event.target.value);
    };

    const validatePassword = (isValid: boolean) => {
        onPasswordValid(isValid);
    };

    return (
        <>
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="password"
                rules={[
                    {
                        required: true, message: 'Введіть пароль',
                    },
                    {
                        validator: validatePatternPassword('Пароль'),
                    },
                ]}
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
                onChange={(isValid) => validatePassword(isValid)}
            />
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="passwordConfirmation"
                rules={[
                    {
                        required: true, message: 'Введіть пароль підтведження',
                    },
                    {
                        validator: validatePatternPassword('Пароль'),
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

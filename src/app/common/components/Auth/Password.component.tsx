import './Password.styles.scss';

import React, { useState } from 'react';
import PasswordStrengthIndicator from '@components/Auth/PasswordStrengthIndicator/PasswordStrengthIndicator';
import validateConfirmPassword from '@utils/userValidators/validateConfirmPassword';
import validatePatternPassword from '@utils/userValidators/validatePassword';
import validateRequired from '@utils/userValidators/validateRequired';

import { Form, Input } from 'antd';

interface Props {
    setIsPasswordValid: (field: boolean) => void;
    isPasswordValid: boolean;
}

const Password = ({ setIsPasswordValid, isPasswordValid } : Props) => {
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleInputPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleInputPasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(event.target.value);
    };

    return (
        <div className="passwordInputsWrapper">
            <div className="firstPasswordInputWrapper">
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="password"
                    label="Пароль"
                    className="formItem"
                    rules={[
                        {
                            validator: validateRequired('Пароль'),
                        },
                        {
                            validator: validatePatternPassword(),
                        },
                    ]}
                >
                    <Input.Password
                        value={password}
                        className="passwordInputField"
                        onChange={handleInputPasswordChange}
                        maxLength={20}
                    />
                </Form.Item>
                <p
                    className={`passwordMessage ${
                        !isPasswordValid && password.length > 0 ? 'passwordMessageInvalid' : ''
                    }`}
                >
                    Від 8 до 20 символів, велика і мала літера, цифра, спеціальний символ.
                </p>
                <PasswordStrengthIndicator
                    password={password}
                    setIsPasswordValid={setIsPasswordValid}
                />
            </div>
            <Form.Item
                wrapperCol={{ span: 24 }}
                name="passwordConfirmation"
                label="Підтвердження паролю"
                className="formItem"
                rules={[
                    {
                        validator: validateRequired('Пароль підтвердження'),
                    },
                    {
                        validator: validatePatternPassword(),
                    },
                    {
                        validator: validateConfirmPassword(password),
                    },
                ]}
            >
                <Input.Password
                    value={passwordRepeat}
                    className="passwordInputField"
                    onChange={handleInputPasswordRepeatChange}
                    maxLength={20}
                />
            </Form.Item>
        </div>
    );
};

export default Password;

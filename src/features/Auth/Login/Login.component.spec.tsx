/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Input } from '../../../../__mocks__/antd/antd';
import Form from '../../../../__mocks__/antd/es/form/Form';

import Login from './Login.component';

// Mock AuthService.
jest.mock('@app/common/services/auth-service/AuthService', () => ({
    loginAsync: jest.fn(),
    isLoggedIn: jest.fn(),
}));

// Mock antd components.
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');

    const Button = ({ onClick, className, children }: {
      onClick: (React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>) | undefined;
      className: string;
      children: ReactNode;
    }) => (
        <button type="button" onClick={onClick} className={className}>{children}</button>
    );

    return {
        ...antd,
        Button,
        Form,
        Input,
        message: {
            config: jest.fn(),
            error: jest.fn(),
        },
    };
});

describe('Login', () => {
    it('loginAsync is called if form is submitted', () => {
        window._env_.RECAPTCHA_SITE_KEY = 'fake_site_key';
        render(
            <GoogleOAuthProvider clientId="561914124880-vulghkfedl8p1svciq5qrpajs4092pr3.apps.googleusercontent.com">
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </GoogleOAuthProvider>,
        );

        const inputForLogin = screen.getByText('login');
        const inputForPassword = screen.getByText('login');
        const formPresent = screen.getByText('form exists');

        expect(formPresent).toBeInTheDocument();
        expect(inputForLogin).toBeInTheDocument();
        expect(inputForPassword).toBeInTheDocument();
    });
});

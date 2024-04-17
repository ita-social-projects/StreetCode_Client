/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Input } from '../../../../__mocks__/antd/antd';
import Form from '../../../../__mocks__/antd/es/form/Form';

import AdminLogin from './AdminLogin.component';

// Mock AuthService.
jest.mock('@/app/common/services/auth-service/AuthService', () => ({
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

    const message = () => ({
        error: jest.fn(),
    });

    return {
        ...antd,
        Button,
        Form,
        Input,
        message,
    };
});

describe('AdminLogin', () => {
    it('should render component and its elements', () => {
        window._env_.RECAPTCHA_SITE_KEY = 'fake_site_key';
        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>,
        );

        const inputForLogin = screen.getByText('login');
        const inputForPassword = screen.getByText('login');
        const formPresent = screen.getByText('form exists');

        expect(formPresent).toBeInTheDocument();
        expect(inputForLogin).toBeInTheDocument();
        expect(inputForPassword).toBeInTheDocument();
    });
});

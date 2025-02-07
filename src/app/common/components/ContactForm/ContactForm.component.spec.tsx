import { cleanup, render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import EmailApi from '@/app/api/email/email.api';

import '@testing-library/jest-dom';

import ContactForm from './ContactForm.component';

// needed to render component without errors
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: unknown) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
});

jest.mock('react-google-recaptcha-v3', () => ({
    useGoogleReCaptcha: () => ({
        executeRecaptcha: jest.fn(() => Promise.resolve('mock-token')),
    }),
}));

// mock backend api calls
jest.mock('@/app/api/email/email.api', () => ({
    send: jest.fn(() => Promise.resolve()),
}));

describe('ContactForm test', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('should be rendered', async () => {
        render(
            <ContactForm />,
        );

        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i);
        const inputEmail = screen.getByPlaceholderText(/E-mail/i);
        const buttonSend = screen.getByText(/Відправити/i);

        await waitFor(() => {
            expect(textareaMessage).toBeInTheDocument();
            expect(inputEmail).toBeInTheDocument();
            expect(buttonSend).toBeInTheDocument();
        });
    });

    it('should send Email with filled fields', async () => {
        render(<ContactForm />);

        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i);
        const inputEmail = screen.getByPlaceholderText(/E-mail/i);
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'test@mail.com';

        user.type(inputEmail, email);
        user.type(textareaMessage, message);
        user.click(sendButton);

        await waitFor(() => {
            expect(EmailApi.send).toHaveBeenCalledWith({
                from: email,
                source: 'сторінка Контакти',
                content: message,
                token: 'mock-token',
            });
        });
    });

    it('should not send Email with invalid email field', async () => {
        render(<ContactForm />);

        const inputEmail = screen.getByPlaceholderText(/E-mail/i);
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i);
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'invalid email';

        user.type(inputEmail, email);
        user.type(textareaMessage, message);
        user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/E-mail може містити/i)).toBeInTheDocument();
        });

        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should not send Email with empty message field', async () => {
        render(<ContactForm />);

        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const sendButton = screen.getByText(/Відправити/i);

        const email = 'valid@email.com';

        user.type(inputEmail, email);

        user.click(sendButton);

        expect(textareaMessage.value).toBe('');
        expect(inputEmail.value).toBe(email);
        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should not send Email without ReCAPTCHA', async () => {
        render(<ContactForm />);

        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'valid@email.com';

        user.type(inputEmail, email);
        user.type(textareaMessage, message);
        user.click(sendButton);

        expect(inputEmail.value).toBe(email);
        expect(textareaMessage.value).toBe(message);
        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should check text amount restrictions and Email validation', async () => {
        render(<ContactForm />);

        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i);
        const sendButton = screen.getByText(/Відправити/i);

        const descriptionRestriction = 500;
        const invalidEmail = 'invalid@email.c';
        const veryLongText = 'a'.repeat(550);

        await waitFor(() => {
            user.type(inputEmail, invalidEmail, { delay: 0 });
            user.type(textareaMessage, veryLongText, { delay: 0 });
        });

        user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/E-mail може містити/i)).toBeInTheDocument();
        });

        expect(textareaMessage.value.length).toBe(descriptionRestriction);
    });
});

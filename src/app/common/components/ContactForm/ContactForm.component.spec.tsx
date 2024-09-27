import {
    cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';
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

// mock ReCAPTCHA component
const onCaptchaMock = jest.fn();
jest.mock('react-google-recaptcha', () => jest.fn(({ onChange }) => (
    <div data-testid="mock-recaptcha">
        <button
            type="button"
            onClick={() => {
                if (onChange) onChange('mock-token');
                onCaptchaMock();
            }}
        >
                Verify ReCAPTCHA
        </button>
    </div>
)));

// mock backend api calls
jest.mock('@/app/api/email/email.api', () => ({
    send: jest.fn(() => {}),
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
        render(
            <ContactForm />,
        );

        // Arrange
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const captchaButton = screen.getByText(/Verify ReCAPTCHA/i);
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'test@mail.com';

        // Act
        await waitFor(async () => {
            user.type(inputEmail, email);
            user.type(textareaMessage, message);
            user.click(captchaButton);
            user.click(sendButton);
        });

        // Assert
        expect(textareaMessage.value).toBe(message);
        expect(inputEmail.value).toBe(email);
        expect(onCaptchaMock).toHaveBeenCalled();
        expect(EmailApi.send).toHaveBeenCalled();
    });

    it('should not send Email with invalid email field', async () => {
        render(
            <ContactForm />,
        );

        // Arrange
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const captchaButton = screen.getByText(/Verify ReCAPTCHA/i);
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'invalid email';

        // Act
        await waitFor(async () => {
            user.type(inputEmail, email);
            user.type(textareaMessage, message);
            user.click(captchaButton);
            user.click(sendButton);
        });

        // Assert
        expect(textareaMessage.value).toBe(message);
        expect(inputEmail.value).toBe(email);
        expect(onCaptchaMock).toHaveBeenCalled();
        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should not send Email with epty message field', async () => {
        render(
            <ContactForm />,
        );

        // Arrange
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const captchaButton = screen.getByText(/Verify ReCAPTCHA/i);
        const sendButton = screen.getByText(/Відправити/i);

        const email = 'valid@email.com';

        // Act
        await waitFor(async () => {
            user.type(inputEmail, email);
            user.click(captchaButton);
            user.click(sendButton);
        });

        // Assert
        expect(textareaMessage.value).toBe('');
        expect(inputEmail.value).toBe(email);
        expect(onCaptchaMock).toHaveBeenCalled();
        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should not send Email without ReCAPTCHA', async () => {
        render(
            <ContactForm />,
        );

        // Arrange
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i) as HTMLInputElement;
        const sendButton = screen.getByText(/Відправити/i);

        const message = 'Some interesting message';
        const email = 'valid@email.com';

        // Act
        await waitFor(async () => {
            user.type(inputEmail, email);
            user.type(textareaMessage, message);
            user.click(sendButton);
        });

        // Assert
        expect(inputEmail.value).toBe(email);
        expect(textareaMessage.value).toBe(message);
        expect(onCaptchaMock).not.toHaveBeenCalled();
        expect(EmailApi.send).not.toHaveBeenCalled();
    });

    it('should check text amount restrictions and Email validation', async () => {
        render(
            <ContactForm />,
        );

        // Arrange
        const textareaMessage = screen.getByPlaceholderText(/Наші серця/i) as HTMLTextAreaElement;
        const inputEmail = screen.getByPlaceholderText(/E-mail/i);
        const buttonSend = screen.getByText(/Відправити/i);

        const descriptionRestriction = 500;
        const invalidEmail = 'invalid@email.c';
        const text = 'String which excides text amount limit';
        const veryLongText = text.repeat(13);

        // Act
        await waitFor(async () => {
            user.type(inputEmail, invalidEmail);

            // user.type() takes too much time to input all the text, so fireEvent.change() partially
            // fills description and user.type() tries to exceed text amount restrictions\
            fireEvent.change(textareaMessage, { target: { value: veryLongText } });
            user.type(textareaMessage, text);

            user.click(buttonSend);
        });

        // Assert
        const validationMessage = await screen.findByText(/E-mail може містити/i);
        expect(validationMessage).toBeInTheDocument();
        expect(textareaMessage.value.length).toBe(descriptionRestriction);
        expect(EmailApi.send).not.toHaveBeenCalled();
    });
});

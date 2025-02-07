import './index.scss';
import '@fonts/fonts.styles.scss';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { RouterProvider } from 'react-router-dom';
import createRoutes from '@app/router/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import WithClearCache from './app/common/components/withClearCache';

declare global {
    interface Window {
        _env_: {
            API_URL: string;
            SERVER_API_URL: string;
            REACT_APP_GOOGLE_ANALYTICS: string;
            RECAPTCHA_SITE_KEY: string;
            VERSION: string;
        };
    }
}

ReactGA.initialize('G-2RHY04JKG0');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .catch((error) => {
                console.error('SW registration failed:', error);
            });
    });
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient();

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!clientId) {
    console.error('REACT_APP_GOOGLE_CLIENT_ID is not defined');
    throw new Error('Google Client ID is required');
}

const recaptchaKey = process.env.RECAPTCHA_SITE_KEY;
if (!recaptchaKey) {
    console.error('RECAPTCHA_SITE_KEY_V3 is not defined');
    throw new Error('ReCaptcha Key is required');
}

const router = createRoutes(recaptchaKey);

root.render(
    <GoogleOAuthProvider clientId={clientId}>
        <WithClearCache>
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <ReactQueryDevtools initialIsOpen />
                </QueryClientProvider>
            </React.StrictMode>
        </WithClearCache>
    </GoogleOAuthProvider>,
);

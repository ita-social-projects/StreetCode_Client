import './index.scss';
import '@fonts/fonts.styles.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { RouterProvider } from 'react-router-dom';
import router from '@app/router/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

declare global {
    interface Window {
        _env_: {
            API_URL: string;
            SERVER_API_URL: string;
            REACT_APP_GOOGLE_ANALYTICS: string;
            RECAPTCHA_SITE_KEY: string;
        };
    }
}

ReactGA.initialize('G-2RHY04JKG0');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient();
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    </React.StrictMode>,
);

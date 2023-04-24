import './index.scss';
import '@fonts/fonts.styles.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { RouterProvider } from 'react-router-dom';
import router from '@app/router/Routes';

ReactGA.initialize('G-2RHY04JKG0');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

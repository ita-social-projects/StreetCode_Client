import '@fonts/fonts.styles.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from '@app/router/Routes';

import './index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

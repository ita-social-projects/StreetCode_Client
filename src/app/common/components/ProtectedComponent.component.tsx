/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';
import AuthService from '../services/AuthService';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }): JSX.Element => {
    const navigate = useNavigate();
    const isLoggedIn = AuthService.isLoggedIn();

    if (!isLoggedIn) {
        AuthService.refreshTokenAsync()
            .catch(() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN));
    }

    if (!Array.isArray(children)) return <>{children}</>;

    return (
        <>
            {children.map((child) => child) }
        </>
    );
};
export default observer(ProtectedComponent);

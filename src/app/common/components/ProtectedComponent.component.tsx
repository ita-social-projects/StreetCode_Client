/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@models/user/user.model';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';
import AuthService from '../services/auth-service/AuthService';

type PropsWithChildren = { children: ReactNode, allowedRoles: UserRole[] | null };
const ProtectedComponent:FC<PropsWithChildren> = ({ children, allowedRoles = null }) => {
    const navigate = useNavigate();
    const isLoggedIn = AuthService.isLoggedIn();

    if (!isLoggedIn) {
        AuthService.refreshTokenAsync()
            .catch(() => navigate(FRONTEND_ROUTES.AUTH.LOGIN));
        return null;
    }

    const currentUserRole = AuthService.getUserRole();
    if (currentUserRole != null
        && allowedRoles
        && !allowedRoles.includes(currentUserRole)) {
        navigate(FRONTEND_ROUTES.OTHER_PAGES.ERROR404);
        return null;
    }

    return (
        <>
            {children}
        </>
    );
};
export default observer(ProtectedComponent);

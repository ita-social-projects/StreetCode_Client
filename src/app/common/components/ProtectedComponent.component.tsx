/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '@models/user/user.model';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';
import AuthService from '../services/auth-service/AuthService';

type PropsWithChildren = {
    children: ReactNode,
    allowedRoles: UserRole[] | null
};

const ProtectedComponent: FC<PropsWithChildren> = ({ children, allowedRoles = null }) => {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAccess = async () => {
            if (!AuthService.isLoggedIn()) {
                try {
                    await AuthService.refreshTokenAsync();
                } catch {
                    navigate(FRONTEND_ROUTES.AUTH.LOGIN, {
                        state: { previousUrl: location.pathname },
                    });
                    return;
                }
            }

            const currentUserRole = AuthService.getUserRole();
            if (currentUserRole && allowedRoles && !allowedRoles.includes(currentUserRole)) {
                navigate(FRONTEND_ROUTES.OTHER_PAGES.ERROR404);
                return;
            }

            setIsAllowed(true);
        };

        checkAccess();
    }, [allowedRoles, navigate, location]);

    if (isAllowed === null) {
        return null;
    }

    return <>{isAllowed ? children : null}</>;
};
export default observer(ProtectedComponent);

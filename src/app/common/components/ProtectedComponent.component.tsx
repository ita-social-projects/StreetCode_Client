/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthStore from '@/app/stores/auth-store';
import useMobx from '@/app/stores/root-store';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }): JSX.Element => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthStore.isLoggedIn()) {
            console.log(AuthStore.isLoggedIn());
            userLoginStore.refreshToken()
                .catch(() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN));
        }
    }, [userLoginStore]);

    if (!Array.isArray(children)) return <>{children}</>;

    return (
        <>
            {children.map((child) => child) }
        </>
    );
};
export default observer(ProtectedComponent);

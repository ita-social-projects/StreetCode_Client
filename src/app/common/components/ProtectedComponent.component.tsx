import { FC, ReactNode } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }): JSX.Element => {
    const navigate = useNavigate();
    const { userLoginStore } = useMobx();
    if (!userLoginStore.isLoggedIn) {
        return <AdminLogin />;
    }
    if (!Array.isArray(children)) return <>{children}</>;
    return (
        <>
            {children.map((child) => child) }
        </>
    );
};
export default ProtectedComponent;

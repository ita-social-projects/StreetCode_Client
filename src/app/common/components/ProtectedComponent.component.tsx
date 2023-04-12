import { FC, ReactNode } from 'react';

import UserLoginStore from '@/app/stores/user-login-store';
import AdminLogin from '@/features/AdminPage/Login/AdminLogin.component';
import useMobx from '@/app/stores/root-store';
import { observer } from 'mobx-react-lite';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }): JSX.Element => {
    const { userLoginStore } = useMobx();
    if (!UserLoginStore.isLoggedIn) {
        return <AdminLogin />;
    }
    if (!Array.isArray(children)) return <>{children}</>;
    return (
        <>
            {children.map((child) => child) }
        </>
    );
};
export default observer(ProtectedComponent);

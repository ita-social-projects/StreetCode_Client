import './UserMenu.styles.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import AuthService from '@app/common/services/auth-service/AuthService';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { UserRole } from '@models/user/user.model';

import { Dropdown, MenuProps, Space } from 'antd';

const UserMenu = () => {
    const navigator = useNavigate();

    const userJSON = localStorage.getItem('authorizedUser');
    const authorizedUser = userJSON ? JSON.parse(userJSON) : null;
    const userRole = UserRole[(authorizedUser?.role as unknown) as keyof typeof UserRole];

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: userRole === UserRole.Admin ? (
                <p>
                    Адмін панель
                </p>
            ) : (
                <p>
                    Профіль
                </p>
            ),
            onClick: () => {
                console.log(authorizedUser?.role);
                console.log(userRole);
                if (userRole === UserRole.Admin) {
                    navigator(FRONTEND_ROUTES.ADMIN.BASE);
                } else {
                    navigator(FRONTEND_ROUTES.OTHER_PAGES.PROFILE);
                }
            },
        },
        {
            key: '2',
            label: (
                <p>
                    Вийти
                </p>
            ),
            danger: true,
            onClick: () => {
                AuthService.logout();
                navigator(FRONTEND_ROUTES.BASE);
            },
        },
    ];

    return (
        <Space direction="vertical">
            <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow
                overlayClassName="dropdownUser"
            >
                <UserOutlined />
            </Dropdown>
        </Space>
    );
};

export default UserMenu;

import './AdminMenu.styles.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileOutlined } from '@ant-design/icons';
import AuthService from '@app/common/services/auth-service/AuthService';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

import { Dropdown, MenuProps, Space } from 'antd';

const AdminMenu = () => {
    const navigator = useNavigate();
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <p>
                    Адмін панель
                </p>
            ),
            onClick: () => {
                navigator(FRONTEND_ROUTES.ADMIN.BASE);
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
                overlayClassName="dropdownAdmin"
            >
                <ProfileOutlined />
            </Dropdown>
        </Space>
    );
};

export default AdminMenu;

// eslint-disable-next-line no-restricted-imports
import '../../AdminPage.styles.scss';

import { useEffect } from 'react';

import { ConfigProvider } from 'antd';
import ukUA from 'antd/locale/uk_UA';

// eslint-disable-next-line no-restricted-imports
import TimelineBlockAdmin from '../TimelineBlock/TimelineBlockAdmin.component';

import MainBlockAdmin from './MainBlockAdmin.component';

const Addnewmainblock = () => {
    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);
    return (
        <ConfigProvider locale={ukUA}>
            <div className="adminPageContainer">
                <div className="MainBlockContainer">
                    <MainBlockAdmin />
                    <TimelineBlockAdmin />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Addnewmainblock;

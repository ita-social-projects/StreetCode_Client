import '../../AdminPage.styles.scss';

import { ConfigProvider } from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import LocaleProvider from 'antd/lib/locale';
import ukUA from 'antd/locale/uk_UA';

import MainBlockAdmin from './MainBlockAdmin.component';

const Addnewmainblock = () => {
    ukUA.DatePicker.lang.locale = 'uk';
    return (
        <ConfigProvider locale={ukUA}>
            <div className="adminPageContainer">
                <div className="MainBlockContainer">
                    <MainBlockAdmin />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Addnewmainblock;

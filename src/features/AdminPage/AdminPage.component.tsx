import './AdminPage.styles.scss';

import { useState } from 'react';

import { Switch } from 'antd';

import StreetcodesTable from './StreetcodesTable/StreetcodesTable.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';

const AdminPage = () => {
    const [streetcodeType, setStreetcodeType] = useState<'people' | 'event'>('people');
    const onSwitchChange = (value:boolean) => {
        if (value) {
            setStreetcodeType('event');
        } else {
            setStreetcodeType('people');
        }
    };
    return (
        <div className="adminPageContainer">
            <StreetcodesTable />
            <div className="MainBlockContainer">
                Персона
                <Switch className="person-event-switch" onChange={onSwitchChange} />
                Подія
               <MainBlockAdmin streetcodeType={streetcodeType} />
                
            </div>
        </div>
    );
};

export default AdminPage;

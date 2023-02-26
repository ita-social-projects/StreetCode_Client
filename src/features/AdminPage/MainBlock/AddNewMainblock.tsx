import { Switch } from "antd";
import { useState } from "react";
import StreetcodesTable from "../StreetcodesTable/StreetcodesTable.component";
import MainBlockAdmin from "./MainBlockAdmin.component";

const Addnewmainblock = () => {
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
            <div className="MainBlockContainer">
                Персона
                <Switch className="person-event-switch" onChange={onSwitchChange} />
                Подія
               <MainBlockAdmin streetcodeType={streetcodeType} />
            </div>
        </div>
    );
};
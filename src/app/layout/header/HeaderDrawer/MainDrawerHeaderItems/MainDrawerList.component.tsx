import { useEffect, useState } from 'react';
import HeaderDrawerItem from '@app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

interface Props {
    scalingCooficient: number;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
}

const MainDrawerList = ({ active, scalingCooficient, setActive } : Props) => {
    const [adjust, setAdjust] = useState(0);
    useEffect(() => {
        setAdjust(scalingCooficient === 1 ? 0 : 1);
    }, [scalingCooficient]);
    return (
        <div className="headerDrawerContainer">
            <HeaderDrawerItem
                id={1 * scalingCooficient}
                parentActive={active}
                setParentActive={setActive}
                text="Головна"
                link = "/"
            />
            <HeaderDrawerItem
                id={2 * scalingCooficient}
                parentActive={active}
                setParentActive={setActive}
                text="Стріткоди"
                link = "/catalog"
            />
            <HeaderDrawerItem
                id={3 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Про нас"
                link = "/"
            />
            <HeaderDrawerItem
                id={4 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Партнери"
                link = "/partners-page"
            />
            <HeaderDrawerItem
                id={5 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Донати"
                link = "/support-us"
            />
            <HeaderDrawerItem
                id={6 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Контакти"
                link = "/contact-us"
            />
        </div>
    );
};
export default MainDrawerList;

import { useEffect, useState } from 'react';
import HeaderDrawerItem from '@app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

interface Props {
    scalingCooficient: number;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
    toggleState: () => void;
}

const MainDrawerList = ({ active, scalingCooficient, setActive, toggleState } : Props) => {
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
                link="/404"
                toggleState={toggleState}
            />
            <HeaderDrawerItem
                id={2 * scalingCooficient}
                parentActive={active}
                setParentActive={setActive}
                text="Стріткоди"
                link="/catalog"
                toggleState={toggleState}
            />
            <HeaderDrawerItem
                id={3 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Про нас"
                link="404"
                toggleState={toggleState}
            />
            <HeaderDrawerItem
                id={4 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Партнери"
                link="/partners-page"
                toggleState={toggleState}
            />
            <HeaderDrawerItem
                id={5 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Донати"
                link="/support-us"
                toggleState={toggleState}
            />
            <HeaderDrawerItem
                id={6 * scalingCooficient - adjust}
                parentActive={active}
                setParentActive={setActive}
                text="Контакти"
                link="/contact-us"
                toggleState={toggleState}
            />
        </div>
    );
};
export default MainDrawerList;

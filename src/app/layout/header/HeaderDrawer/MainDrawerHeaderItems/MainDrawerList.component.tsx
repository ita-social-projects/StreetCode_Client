import HeaderDrawerItem from '@app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

interface Props {
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
}

const MainDrawerList = ({ active, setActive } : Props) => (
    <div className="headerDrawerContainer">
        <HeaderDrawerItem
            id={1}
            parentActive={active}
            setParentActive={setActive}
            text="Головна"
        />
        <HeaderDrawerItem
            id={2}
            parentActive={active}
            setParentActive={setActive}
            text="Стріткоди"
        />
        <HeaderDrawerItem
            id={3}
            parentActive={active}
            setParentActive={setActive}
            text="Про нас"
        />
        <HeaderDrawerItem
            id={4}
            parentActive={active}
            setParentActive={setActive}
            text="Партнери"
        />
        <HeaderDrawerItem
            id={5}
            parentActive={active}
            setParentActive={setActive}
            text="Донати"
        />
        <HeaderDrawerItem
            id={6}
            parentActive={active}
            setParentActive={setActive}
            text="Контакти"
        />
    </div>
);

export default MainDrawerList;

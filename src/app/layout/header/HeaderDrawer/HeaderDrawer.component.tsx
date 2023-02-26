import './HeaderDrawer.styles.scss';

import { useState } from 'react';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle } } = useToggle();
    const [active, setActive] = useState(1);

    return (
        <>
            <Drawer
                placement="right"
                closable
                style={{ zIndex: 0 }}
                onClose={toggle}
                open={drawerState}
                className="drawer"
            >
                <div className="grid-container">
                    <ReactSlider
                        className="customSlider"
                        trackClassName="customSlider-track"
                        thumbClassName="thumb"
                        onSliderClick={() => {}}
                        onChange={() => {}}
                        min={1}
                        max={6}
                        value={active}
                        renderTrack={(props) => <div {...props} />}
                        orientation="vertical"
                    />
                    <div className="headerDrawerContainer">
                        <HeaderDrawerItem id={1} parentActive={active} setParentActive={setActive} text="Головна" />
                        <HeaderDrawerItem id={2} parentActive={active} setParentActive={setActive} text="Стріткоди" />
                        <HeaderDrawerItem id={3} parentActive={active} setParentActive={setActive} text="Про нас" />
                        <HeaderDrawerItem id={4} parentActive={active} setParentActive={setActive} text="Партнери" />
                        <HeaderDrawerItem id={5} parentActive={active} setParentActive={setActive} text="Донати" />
                        <HeaderDrawerItem id={6} parentActive={active} setParentActive={setActive} text="Контакти" />
                    </div>
                </div>
            </Drawer>
            <BurgerMenu onClick={toggle} />
        </>
    );
};

export default HeaderDrawer;

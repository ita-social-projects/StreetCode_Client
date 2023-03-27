import './HeaderDrawer.styles.scss';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
// import useMediaQuery from '@hooks/external/useMediaQuery.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

import MainDrawerList from './MainDrawerHeaderItems/MainDrawerList.component';
import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks.component';

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle } } = useToggle();
    const [active, setActive] = useState(1);
    const [options, setOptions] = useState(6);
    const isSmall = useMediaQuery({
        query: '(max-width: 768px)',
    });

    // const isSmall = useMediaQuery(768, 'max-width');

    useEffect(() => {
        if (isSmall) {
            setOptions(8);
        } else {
            setOptions(6);
        }
    }, [isSmall]);

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
                        max={options}
                        value={active}
                        renderTrack={(props) => <div {...props} />}
                        orientation="vertical"
                    />
                    {!isSmall
                        && (
                            <div>
                                <MainDrawerList active={active} setActive={setActive} />
                            </div>
                        )}
                    {isSmall
                        && (
                            <div>
                                <MainDrawerList active={active} setActive={setActive} />
                                <br />
                                <div className="headerDrawerContainer">
                                    <HeaderDrawerItem
                                        id={7}
                                        parentActive={active}
                                        setParentActive={setActive}
                                        text="Політика конфіденційності"
                                    />
                                    <HeaderDrawerItem
                                        id={8}
                                        parentActive={active}
                                        setParentActive={setActive}
                                        text="Зворотній зв'язок"
                                    />
                                </div>
                                <SocialMediaLinks />
                            </div>
                        )}
                </div>
            </Drawer>
            <BurgerMenu onClick={toggle} />
        </>
    );
};

export default HeaderDrawer;

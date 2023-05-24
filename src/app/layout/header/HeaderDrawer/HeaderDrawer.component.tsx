import './HeaderDrawer.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn_drawer_mobile.svg';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks.component';

const mobileOptions = 8;
const desktopOptions = 6;
const scaleDesktop = 1;
const scaleMobile = 5;
const menuPositionsMobile = [
    1 * scaleMobile,
    2 * scaleMobile - 1,
    3 * scaleMobile - 1,
    4 * scaleMobile - 1,
    5 * scaleMobile - 1,
    6 * scaleMobile - 1,
    7 * scaleMobile - 1,
    8 * scaleMobile,
];
const menuOptions = [
    '/',
    '/catalog',
    '/404',
    '/partners-page',
    '/support-us',
    '/contact-us',
    '/privacy-policy',
    '/404',
];

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle } } = useToggle();
    const [active, setActive] = useState(1);
    const [options, setOptions] = useState(desktopOptions);
    const [scalingCooficient, setScalingCooficient] = useState(scaleDesktop);
    const location = useLocation();

    const isSmall = useMediaQuery({
        query: '(max-width: 1024px)',
    });

    useEffect(() => {
        const optionId = menuOptions.indexOf(location.pathname);
        if (isSmall) {
            setScalingCooficient(scaleMobile);
            setOptions(mobileOptions);
            setActive(menuPositionsMobile[optionId]);
        } else {
            setScalingCooficient(scaleDesktop);
            setOptions(desktopOptions);
            setActive(optionId + 1);
        }
    }, [isSmall, location]);

    return (
        <div className="drawerContainer">
            <Drawer
                placement="right"
                closable
                style={{ zIndex: 0 }}
                onClose={toggle}
                open={drawerState}
                closeIcon={<CancelBtn />}
            >
                <div className="grid-container">
                    <ReactSlider
                        className="customSlider"
                        trackClassName="customSlider-track"
                        thumbClassName="thumb"
                        min={scalingCooficient}
                        max={options * scalingCooficient}
                        value={active}
                        renderTrack={(props) => <div {...props} />}
                        orientation="vertical"
                    />
                    <div>
                        <div className="headerDrawerContainer">
                            <HeaderDrawerItem
                                id={1}
                                parentActive={active}
                                text="Головна"
                                link={menuOptions[0]}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={2}
                                parentActive={active}
                                text="Стріткоди"
                                link={menuOptions[1]}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={3}
                                parentActive={active}
                                text="Про нас"
                                link={menuOptions[2]}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={4}
                                parentActive={active}
                                text="Партнери"
                                link={menuOptions[3]}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={5}
                                parentActive={active}
                                text="Донати"
                                link={menuOptions[4]}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={6}
                                parentActive={active}
                                text="Контакти"
                                link={menuOptions[5]}
                                toggleState={toggle}
                            />
                        </div>
                        {isSmall
                        && (
                            <>
                                <br />
                                <div className="headerDrawerContainer">
                                    <HeaderDrawerItem
                                        id={7}
                                        parentActive={active}
                                        toggleState={toggle}
                                        text="Політика конфіденційності"
                                        link={menuOptions[6]}
                                    />
                                    <HeaderDrawerItem
                                        id={8}
                                        parentActive={active}
                                        toggleState={toggle}
                                        text="Зворотний зв'язок"
                                        link={menuOptions[7]}
                                    />
                                </div>
                                <SocialMediaLinks />
                            </>
                        )}
                    </div>
                </div>
            </Drawer>
            <BurgerMenu onClick={toggle} />
        </div>
    );
};

export default HeaderDrawer;

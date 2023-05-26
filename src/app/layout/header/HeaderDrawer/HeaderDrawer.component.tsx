import './HeaderDrawer.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn_drawer_mobile.svg';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks.component';

const mobileOptions = 8;
const desktopOptions = 6;
const scaleDesktop = 1;
const scaleMobile = 5;
const menuPositionsMobile = [
    1 * scaleMobile,
    2 * scaleMobile,
    3 * scaleMobile - 1,
    4 * scaleMobile - 1,
    5 * scaleMobile - 1,
    6 * scaleMobile - 1,
    7 * scaleMobile - 1,
    8 * scaleMobile,
];
const menuOptions = [
    FRONTEND_ROUTES.BASE,
    FRONTEND_ROUTES.OTHER_PAGES.CATALOG,
    FRONTEND_ROUTES.OTHER_PAGES.ERROR404,
    FRONTEND_ROUTES.OTHER_PAGES.PARTNERS,
    FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US,
    FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US,
    FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY,
    FRONTEND_ROUTES.OTHER_PAGES.ERROR404,
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
                                link={FRONTEND_ROUTES.BASE}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={2}
                                parentActive={active}
                                text="Стріткоди"
                                link={FRONTEND_ROUTES.OTHER_PAGES.CATALOG}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={3}
                                parentActive={active}
                                text="Про нас"
                                link={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={4}
                                parentActive={active}
                                text="Партнери"
                                link={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={5}
                                parentActive={active}
                                text="Донати"
                                link={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={6}
                                parentActive={active}
                                text="Контакти"
                                link={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US}
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
                                        link={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY}
                                    />
                                    <HeaderDrawerItem
                                        id={8}
                                        parentActive={active}
                                        toggleState={toggle}
                                        text="Зворотний зв'язок"
                                        link={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}
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

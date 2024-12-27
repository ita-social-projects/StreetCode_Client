import './HeaderDrawer.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn_drawer_mobile.svg';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import { ContactUsModal } from '@/app/common/components/modals/ContactUsModal/ContactUsModal.component';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks.component';

const mobileOptions = 8;
const desktopOptions = 6;
const scaleDesktop = 1;
const scaleMobile = 12;
const menuPositionsMobile = [
    1 * scaleMobile,
    2 * scaleMobile,
    3 * scaleMobile - 1,
    4 * scaleMobile - 2,
    5 * scaleMobile - 3,
    6 * scaleMobile - 3,
    7 * scaleMobile - 2,
    8 * scaleMobile,
];
const menuOptions = [
    FRONTEND_ROUTES.BASE,
    FRONTEND_ROUTES.OTHER_PAGES.CATALOG,
    FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US,
    FRONTEND_ROUTES.OTHER_PAGES.PARTNERS,
    FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US,
    FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US,
    FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY,
    FRONTEND_ROUTES.OTHER_PAGES.ERROR404,
];

const MENU_ID = {
    HOME: 1,
    CATALOG: 2,
    ABOUT: 3,
    PARTNERS: 4,
    DONATE: 5,
    CONTACTS: 6,
    PRIVACY_POLICY: 7,
    FEEDBACK: 8,
};

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle } } = useToggle();
    const [active, setActive] = useState(1);
    const [options, setOptions] = useState(desktopOptions);
    const [scalingCooficient, setScalingCooficient] = useState(scaleDesktop);
    const location = useLocation();

    const isSmall = useMediaQuery({
        query: '(max-width: 1024px)',
    });

    const getMenuOptionIdByCurrentPath = (currentPath: string) => {
        const optionId = menuOptions.indexOf(currentPath);

        // on the desktop there is no Privacy Policy menu item
        const isDesktopAndPrivacyPath = !isSmall && currentPath === FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY;

        if (optionId >= 0 && !isDesktopAndPrivacyPath) {
            return optionId;
        }

        // if the current path does not match any menu item
        // and is not streetcode page, stay at the beginning
        if (currentPath.startsWith('/news')
            || isDesktopAndPrivacyPath) {
            return 0;
        }

        // otherwise return Streetcodes menu option ID
        return 1;
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const optionId = getMenuOptionIdByCurrentPath(currentPath);

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
            <ScrollRestoration />
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
                                id={MENU_ID.HOME}
                                parentActive={active}
                                text="Головна"
                                link={FRONTEND_ROUTES.BASE}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={MENU_ID.CATALOG}
                                parentActive={active}
                                text="History-коди"
                                link={FRONTEND_ROUTES.OTHER_PAGES.CATALOG}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={MENU_ID.ABOUT}
                                parentActive={active}
                                text="Про нас"
                                link={FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={MENU_ID.PARTNERS}
                                parentActive={active}
                                text="Партнери"
                                link={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={MENU_ID.DONATE}
                                parentActive={active}
                                text="Донати"
                                link={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US}
                                toggleState={toggle}
                            />
                            <HeaderDrawerItem
                                id={MENU_ID.CONTACTS}
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
                                            id={MENU_ID.PRIVACY_POLICY}
                                            parentActive={active}
                                            toggleState={toggle}
                                            text="Політика конфіденційності"
                                            link={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY}
                                        />
                                        <ContactUsModal
                                            toggleState={toggle}
                                            text="Зворотний зв'язок"
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

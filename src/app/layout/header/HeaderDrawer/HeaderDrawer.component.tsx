import './HeaderDrawer.styles.scss';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ReactSlider from 'react-slider';
import BurgerMenu from '@components/BurgerMenu/BurgerMenu.component';
import useToggle from '@hooks/stateful/useToggle.hook';

import { Drawer } from 'antd';

import HeaderDrawerItem from '@/app/layout/header/HeaderDrawer/HeaderDrawerItem/HeaderDrawerItem.component';

import MainDrawerList from './MainDrawerHeaderItems/MainDrawerList.component';
import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks.component';

const HeaderDrawer = () => {
    const { toggleState: drawerState, handlers: { toggle } } = useToggle();
    const [active, setActive] = useState(1);
    const [options, setOptions] = useState(6);
    const [scalingCooficient, setScalingCooficient] = useState(1);
    const isSmall = useMediaQuery({
        query: '(max-width: 768px)',
    });

    useEffect(() => {
        if (isSmall) {
            setScalingCooficient(4);
            setOptions(8);
        } else {
            setScalingCooficient(1);
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
                        min={scalingCooficient}
                        max={options * scalingCooficient}
                        value={active}
                        renderTrack={(props) => <div {...props} />}
                        orientation="vertical"
                    />
                    {!isSmall
                        && (
                            <div>
                                <MainDrawerList
                                    active={active}
                                    setActive={setActive}
                                    scalingCooficient={scalingCooficient}
                                />
                            </div>
                        )}
                    {isSmall
                        && (
                            <div>
                                <MainDrawerList
                                    active={active}
                                    setActive={setActive}
                                    scalingCooficient={scalingCooficient}
                                />
                                <br />
                                <div className="headerDrawerContainer">
                                    <HeaderDrawerItem
                                        id={7 * scalingCooficient}
                                        parentActive={active}
                                        setParentActive={setActive}
                                        text="Політика конфіденційності"
                                        link="privacy-policy"
                                    />
                                    <HeaderDrawerItem
                                        id={8 * scalingCooficient}
                                        parentActive={active}
                                        setParentActive={setActive}
                                        text="Зворотний зв'язок"
                                        link="404"
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

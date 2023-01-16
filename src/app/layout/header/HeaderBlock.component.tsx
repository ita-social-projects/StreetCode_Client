import './HeaderBlock.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import StreetcodeSvg from '@images/header/Streetcode_title.svg';

import { observer } from 'mobx-react-lite';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import useEventListener from '@hooks/external/useEventListener.hook';
import useOnClickOutside from '@hooks/stateful/useClickOutside.hook';
import HeaderDrawer from '@layout/header/HeaderDrawer/HeaderDrawer.component';
import HeaderSkeleton from '@layout/header/HeaderSkeleton/HeaderSkeleton.component';
import LanguageSelector from '@layout/header/LanguageSelector/LanguageSelector.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

const HeaderBlock = () => {
    const [isInputActive, setIsInputActive] = useState(false);
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);

    const ref = useRef<HTMLInputElement>(null);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useMobx();

    const onDimCancel = useCallback((e?: Event) => {
        e?.stopPropagation();

        setIsInputActive(false);
        setIsPageDimmed(false);
    }, [setIsPageDimmed]);

    useEventListener('scroll', () => {
        setIsHeaderHidden(window.scrollY > 1600);
    });

    useEffect(onDimCancel, [isHeaderHidden, onDimCancel]);
    useOnClickOutside(ref, onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    return (
        <>
            <div className={`navBarContainer ${isHeaderHidden ? 'hiddenNavBar' : ''}`}>
                <div className="leftPartContainer">
                    <StreetcodeSvg />
                    <input
                        ref={ref}
                        className={`ant-input css-dev-only-do-not-override-26rdvq hiddenHeaderInput
                        ${((isInputActive && isHeaderHidden) ? 'active' : '')}`}
                    />
                    <HeaderSkeleton />
                    <LanguageSelector />
                </div>
                <div className="rightPartContainer">
                    <div className="rightSectionContainer">
                        {isHeaderHidden && (
                            <MagnifyingGlass
                                viewBox="0 0 24 24"
                                onClick={() => {
                                    setIsInputActive((prev) => !prev);
                                    setIsPageDimmed();
                                }}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        <HeaderDrawer />
                        <Button
                            type="primary"
                            className="loginBtn"
                            onClick={() => setModal('login')}
                        >
                            Долучитися
                        </Button>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default observer(HeaderBlock);

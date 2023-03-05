import './HeaderBlock.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import StreetcodeSvg from '@images/header/Streetcode_title.svg';

import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import useEventListener from '@hooks/external/useEventListener.hook';
import useOnClickOutside from '@hooks/stateful/useClickOutside.hook';
import useToggle from '@hooks/stateful/useToggle.hook';
import HeaderDrawer from '@layout/header/HeaderDrawer/HeaderDrawer.component';
import HeaderSkeleton from '@layout/header/HeaderSkeleton/HeaderSkeleton.component';
//import LanguageSelector from '@layout/header/LanguageSelector/LanguageSelector.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

const HeaderBlock = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();

    const inputRef = useRef<HTMLInputElement>(null);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useMobx();

    const onDimCancel = useCallback((e?: Event) => {
        e?.stopPropagation();

        off();
        setIsPageDimmed(false);
    }, [setIsPageDimmed, off]);

    useEventListener('scroll', () => {
        setIsHeaderHidden(window.scrollY > 100);
    });

    useEffect(onDimCancel, [isHeaderHidden, onDimCancel]);
    useOnClickOutside(inputRef, onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    const onMagnifyingGlassClick = () => {
        setIsPageDimmed();
        toggle();
    };

    return (
        <div className={`navBarContainer ${isHeaderHidden ? 'hiddenNavBar' : ''} ${isPageDimmed ? 'dim' : ''}`}>
            <div className="leftPartContainer">
                <StreetcodeSvg />
                <input placeholder='Пошук...'
                    ref={inputRef}
                    className={`ant-input css-dev-only-do-not-override-26rdvq
                        hiddenHeaderInput ${((isInputActive && isHeaderHidden) ? 'active' : '')}`}
                />
                <HeaderSkeleton />
            </div>
            <div className="rightPartContainer">
                <div className="rightSectionContainer">
                    {isHeaderHidden && (
                        <MagnifyingGlass
                            viewBox="0 0 24 24"
                            onClick={onMagnifyingGlassClick}
                            style={isPageDimmed ? { zIndex: '-1' } : undefined}
                        />
                    )}
                    <HeaderDrawer />
                    <Button
                        type="primary"
                        className="loginBtn"
                        onClick={() => setModal('login')}
                        style={isPageDimmed ? { zIndex: '-1' } : undefined}
                    >
                        Долучитися
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default observer(HeaderBlock);

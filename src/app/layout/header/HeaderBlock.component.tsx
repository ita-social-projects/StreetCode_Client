/* eslint-disable complexity */
import './HeaderBlock.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import MagnifyingGlassMobile from '@images/header/Magnifying_glass_mobile.svg';
import StreetcodeSvg from '@images/header/Streetcode_logo.svg';
import StreetcodeSvgMobile from '@images/header/Streetcode_logo_mobile.svg';

import { observer } from 'mobx-react-lite';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import useEventListener from '@hooks/external/useEventListener.hook';
import useOnClickOutside from '@hooks/stateful/useClickOutside.hook';
import useToggle from '@hooks/stateful/useToggle.hook';
import HeaderDrawer from '@layout/header/HeaderDrawer/HeaderDrawer.component';
import HeaderSkeleton from '@layout/header/HeaderSkeleton/HeaderSkeleton.component';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Popover } from 'antd';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { joinToStreetcodeClickEvent } from '@/app/common/utils/googleAnalytics.unility';

import SearchBlock from './SearchBlock/SearchBlock.component';

const HeaderBlock = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchBlockRef = useRef(null);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useModalContext();
    const dimWrapperRef = useRef(null);
    const windowSize = useWindowSize();

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchQuery(value);
        if (value.length > 0 && windowSize.width > 1024) {
            handlePopoverVisibleChange(true);
        } else {
            handlePopoverVisibleChange(false);
        }
    };

    const closeSearchBlock = () => {
        off();
        setIsPageDimmed(false);
        setIsPopoverVisible(false);
    }

    const onDimCancel = useCallback(() => {
        closeSearchBlock();
    }, [setIsPageDimmed, setIsPopoverVisible, off]);

    useEventListener('scroll', () => {
        setIsHeaderHidden(window.scrollY > 100);
        closeSearchBlock();
    });

    useEffect(onDimCancel, [isHeaderHidden, onDimCancel]);
    
    useOnClickOutside(inputRef, searchBlockRef, onDimCancel);
    
    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    const onMagnifyingGlassClick = () => {
        setIsPageDimmed();
        toggle();
    };

    return (
        <div className="HeaderBlock" ref={dimWrapperRef}>
            <div className={`navBarContainer ${isHeaderHidden ? 'hiddenNavBar' : ''} ${isPageDimmed ? 'dim' : ''}`}>
                <div className="leftPartContainer">
                    <div className='logoContainer' onClick={() => window.location.href = '/'}>
                        {windowSize.width > 1024
                            ? <StreetcodeSvg />
                            : <StreetcodeSvgMobile />}
                    </div>
                    {windowSize.width > 1024 && (
                        <Popover
                            trigger="click"
                            open={isPopoverVisible}
                            getPopupContainer={(trigger: HTMLElement) => trigger.parentNode as HTMLElement}
                            placement="bottomLeft"
                            content={(
                                <div className="headerPopupSkeleton" ref={searchBlockRef}>
                                    <SearchBlock searchQuery={searchQuery}/>
                                </div>
                            )}
                            >
                            <input
                                onChange={handleInputChange}
                                placeholder="Пошук..."
                                ref={inputRef}
                                className={`ant-input  
                                        hiddenHeaderInput ${((isInputActive && isHeaderHidden && windowSize.width > 1024) ? 'active' : '')}`}
                            />
                        </Popover>
                    )}
                    
                    {windowSize.width > 1024 && <HeaderSkeleton />}
                </div>
                <div className="rightPartContainer">
                    <div className="rightSectionContainer">
                        {isHeaderHidden && windowSize.width > 1024 && (
                            <MagnifyingGlass
                                viewBox="0 -2 24 24"
                                transform="scale(1.2)"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        {windowSize.width <= 1024 && (
                            <MagnifyingGlassMobile
                                viewBox="0 -1 25 25"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        <HeaderDrawer />
                        <Button
                            type="primary"
                            className="loginBtn"
                            onClick={() => {
                                setModal('login');
                                joinToStreetcodeClickEvent();
                            }}
                            style={isPageDimmed ? { zIndex: '-1' } : undefined}
                        >
                            Долучитися
                        </Button>
                    </div>
                </div>
            </div>
            <div >
            {windowSize.width <= 1024 && (
                <Popover
                    trigger="click"
                    open={isPopoverVisible}
                    arrow={false}
                    overlayClassName="searchMobPopover"
                    getPopupContainer={(trigger: HTMLElement) => trigger.parentNode as HTMLElement}
                    placement="bottom"
                    content={(
                        <div ref={searchBlockRef}>
                            <SearchBlock searchQuery={searchQuery}/>
                        </div>
                    )}
                >
                    <div ref={inputRef} className={`searchContainerMobile ${(isInputActive ? 'active' : '')}`}>
                        <input
                            onChange={handleInputChange}
                            className="ant-input css-dev-only-do-not-override-26rdvq"
                            placeholder="Що ти шукаєш?"
                        />
                        <Button
                            type="primary"
                            className="searchButton"
                            onClick={() => {
                                handlePopoverVisibleChange(true);
                            }}
                        >
                            Пошук
                        </Button>
                    </div>
                </Popover>
            )}
            </div>
        </div>
    );
};

export default observer(HeaderBlock);

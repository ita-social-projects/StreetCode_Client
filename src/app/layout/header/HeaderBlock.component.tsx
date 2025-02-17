/* eslint-disable complexity */
import './HeaderBlock.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';
import MagnifyingGlassMobile from '@images/header/Magnifying_glass_mobile.svg';
import StreetcodeSvg from '@images/header/Streetcode_logo.svg';
import StreetcodeSvgMobile from '@images/header/Streetcode_logo_mobile.svg';

import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import UserMenu from '@components/UserMenu/UserMenu.component';
import useEventListener from '@hooks/external/useEventListener.hook';
import useOnClickOutside from '@hooks/stateful/useClickOutside.hook';
import useToggle from '@hooks/stateful/useToggle.hook';
import HeaderDrawer from '@layout/header/HeaderDrawer/HeaderDrawer.component';
import { useModalContext } from '@stores/root-store';

import { Button, Input, Popover, PopoverProps } from 'antd';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { joinToStreetcodeClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import StreetcodeFilterRequestDTO, { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

import SearchBlock from './SearchBlock/SearchBlock.component';

const HeaderBlock = () => {
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const searchBlockRef = useRef(null);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useModalContext();
    const dimWrapperRef = useRef(null);
    const [searchResult, setSearchResult] = useState<StreetcodeFilterResultDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigator = useNavigate();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
        if (!visible) {
            setIsLoading(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        const { value } = e.target;
        setSearchQuery(value);
        if (value.length > 0 && isDesktop) {
            handlePopoverVisibleChange(true);
        } else {
            handlePopoverVisibleChange(false);
        }
    };

    const closeSearchBlock = () => {
        off();
        setIsPageDimmed(false);
        setIsPopoverVisible(false);
    };

    const onDimCancel = useCallback(() => {
        closeSearchBlock();
    }, [setIsPageDimmed, setIsPopoverVisible, off]);

    useEventListener('scroll', () => {
        setIsHeaderHidden(window.scrollY > 100);
        closeSearchBlock();
    });

    useEffect(onDimCancel, [isHeaderHidden, onDimCancel]);

    useOnClickOutside([inputRef, searchBlockRef], onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    const onMagnifyingGlassClick = () => {
        setIsPageDimmed();
        toggle();
    };

    const search = () => {
        if (searchQuery.length === 0) {
            setSearchResult([]);
            return;
        }

        const filter: StreetcodeFilterRequestDTO = { searchQuery };

        StreetcodesApi.getByFilter(filter)
            .then((response: StreetcodeFilterResultDTO[]) => {
                setSearchResult(response);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (isDesktop) {
            search();
        }
    }, [searchQuery]);

    const handleOnSearchResultItemClick = () => {
        closeSearchBlock();
        setInputValue('');
    };

    const popoverProps: PopoverProps = {
        trigger: 'click',
        open: isPopoverVisible && !isLoading,
        getPopupContainer: (trigger: HTMLElement) => trigger.parentNode as HTMLElement,
        content: (
            <div ref={searchBlockRef}>
                <SearchBlock searchResult={searchResult} onSearchResultItemClick={handleOnSearchResultItemClick} />
            </div>
        ),
        afterOpenChange: handlePopoverVisibleChange,
    };

    const onInputClick = () => {
        if (!isPageDimmed) {
            setIsPageDimmed();
            toggle();
        }
    };

    const navigateToLogin = () => {
        navigator(FRONTEND_ROUTES.AUTH.LOGIN);
    };

    return (
        <div className="HeaderBlock" ref={dimWrapperRef}>
            <div className={`navBarContainer ${isHeaderHidden ? 'hiddenNavBar' : ''} ${isPageDimmed ? 'dim' : ''}`}>
                <div className="leftPartContainer">
                    <div className="logoContainer">
                        <Link to={FRONTEND_ROUTES.BASE}>
                            {isDesktop ? (
                                <StreetcodeSvg />
                            ) : (
                                <StreetcodeSvgMobile />
                            )}
                        </Link>
                    </div>
                    {isDesktop && isHeaderHidden && (
                        <Popover
                            overlayClassName="searchPopover"
                            placement="bottomLeft"
                            {...popoverProps}
                        >
                            <input
                                onChange={handleInputChange}
                                value={inputValue}
                                placeholder="Пошук..."
                                ref={inputRef}
                                className={
                                    `ant-input hiddenHeaderInput 
                                        ${((isInputActive && isHeaderHidden && isDesktop) ? 'active' : '')}`
                                }
                            />
                        </Popover>
                    )}

                    {isDesktop && !isHeaderHidden && (
                        <div className="searchHeaderSkeleton">
                            <Popover
                                placement="bottomLeft"
                                overlayClassName="searchPopoverSkeleton"
                                {...popoverProps}
                            >
                                <div ref={inputRef}>
                                    <Input
                                        onChange={handleInputChange}
                                        placeholder="Пошук..."
                                        onClick={onInputClick}
                                        value={inputValue}
                                        prefix={(
                                            <MagnifyingGlass
                                                viewBox="0 -2 24 24"
                                                transform="scale(1.2)"
                                                onClick={onMagnifyingGlassClick}
                                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                                            />
                                        )}
                                    />
                                </div>
                            </Popover>
                        </div>
                    )}
                </div>
                <div className="rightPartContainer">
                    <div className="rightSectionContainer">
                        {isHeaderHidden && isDesktop && (
                            <MagnifyingGlass
                                viewBox="0 -2 24 24"
                                transform="scale(1.2)"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        {!isDesktop && (
                            <MagnifyingGlassMobile
                                viewBox="0 -1 25 25"
                                onClick={onMagnifyingGlassClick}
                                style={isPageDimmed ? { zIndex: '-1' } : undefined}
                            />
                        )}
                        {AuthService.isLoggedIn() ? <UserMenu /> : (
                            <Button className="loginButton" onClick={navigateToLogin}>
                                Вхід
                            </Button>
                        ) }
                        <Button
                            type="primary"
                            className="participateButton"
                            onClick={() => {
                                setModal('login');
                                joinToStreetcodeClickEvent();
                            }}
                            style={isPageDimmed ? { zIndex: '-1' } : undefined}
                        >
                            Долучитися
                        </Button>
                        <HeaderDrawer />
                    </div>
                </div>
            </div>
            <div>
                {!isDesktop && (
                    <Popover
                        arrow={false}
                        overlayClassName="searchMobPopover"
                        placement="bottom"
                        {...popoverProps}
                    >
                        <div ref={inputRef} className={`searchContainerMobile ${(isInputActive ? 'active' : '')}`}>
                            <input
                                onChange={handleInputChange}
                                value={inputValue}
                                className="ant-input css-dev-only-do-not-override-26rdvq"
                                placeholder="Що ти шукаєш?"
                            />
                            <Button
                                type="primary"
                                className="searchButton"
                                onClick={() => {
                                    handlePopoverVisibleChange(true);
                                    search();
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

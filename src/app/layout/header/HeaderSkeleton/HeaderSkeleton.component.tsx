import './HeaderSkeleton.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SearchBlock from '@app/layout/header/SearchBlock/SearchBlock.component';
import useToggle from '@hooks/stateful/useToggle.hook';
import useMobx, { useModalContext } from '@stores/root-store';

import { Input, Popover } from 'antd';

import useEventListener from '@/app/common/hooks/external/useEventListener.hook';
import useOnClickOutside from '@/app/common/hooks/stateful/useClickOutside.hook';

const HeaderSkeleton = () => {
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useModalContext();
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();
    const inputRef = useRef(null);
    const searchBlockRef = useRef(null);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
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
        closeSearchBlock();
    });

    useOnClickOutside([inputRef, searchBlockRef], onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

    const onInputClick = () => {
        if (!isPageDimmed) {
            setIsPageDimmed();
            toggle();
        }
    };

    const onMagnifyingGlassClick = () => {
        setIsPageDimmed();
        toggle();
    };

    return (
        <div>
            <Popover
                trigger="click"
                placement="bottomLeft"
                open={isPopoverVisible}
                overlayClassName="searchPopoverSkeleton"
                getPopupContainer={(trigger: HTMLElement) => trigger.parentNode as HTMLElement}
                content={(
                    <div ref={searchBlockRef}>  
                    </div>
                )}
            >
                <div ref={inputRef}>
                    <Input
                        onChange={handleInputChange}
                        placeholder="Пошук..."
                        onClick={onInputClick}
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
    );
};

export default HeaderSkeleton;

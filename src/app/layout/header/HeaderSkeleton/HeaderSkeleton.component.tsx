import './HeaderSkeleton.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { useCallback, useEffect, useRef, useState } from 'react';
import SearchBlock from '@app/layout/header/SearchBlock/SearchBlock.component';

import { Input, Popover } from 'antd';

import useMobx, { useModalContext } from '@stores/root-store';
import useToggle from '@hooks/stateful/useToggle.hook';
import useOnClickOutside from '@/app/common/hooks/stateful/useClickOutside.hook';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import useEventListener from '@/app/common/hooks/external/useEventListener.hook';

const HeaderSkeleton = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const { modalStore: { setModal, setIsPageDimmed, isPageDimmed } } = useModalContext();
    const { toggleState: isInputActive, handlers: { off, toggle } } = useToggle();
    const inputRef = useRef(null);
    const searchBlockRef = useRef(null);
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
        closeSearchBlock();
    });

    useOnClickOutside(inputRef, searchBlockRef, onDimCancel);

    if (isInputActive && !isPageDimmed) {
        setIsPageDimmed(true);
    }

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
                overlayClassName='searchPopoverSkeleton'
                getPopupContainer={(trigger: HTMLElement) => trigger.parentNode as HTMLElement}
                content={(
                    <div className="headerPopupSkeleton"  ref={searchBlockRef}>
                        <SearchBlock searchQuery={searchQuery} />
                    </div>
                )}
            >
                <div ref={inputRef}>
                    <Input
                        onChange={handleInputChange}
                        placeholder="Пошук..."
                        prefix={
                        <MagnifyingGlass
                            viewBox="0 -2 24 24"
                            transform="scale(1.2)"
                            onClick={onMagnifyingGlassClick}
                            style={isPageDimmed ? { zIndex: '-1' } : undefined}
                        />}
                    />
                </div>
            </Popover>
        </div>
    );
};

export default HeaderSkeleton;

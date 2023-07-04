import './HeaderSkeleton.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { useState } from 'react';
import SearchBlock from '@app/layout/header/SearchBlock/SearchBlock.component';

import { Input, Popover } from 'antd';

const HeaderSkeleton = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchQuery(value);
        if (value.length > 0) {
            handlePopoverVisibleChange(true);
        } else {
            handlePopoverVisibleChange(false);
        }
    };

    return (
        <Popover
            trigger="click"
            placement="bottomLeft"
            open={isPopoverVisible}
            content={(
                <div className="headerPopupSkeleton">
                    <SearchBlock searchQuery={searchQuery} />
                </div>
            )}
        >
            <div>
                <Input
                    onChange={handleInputChange}
                    placeholder="Пошук..."
                    prefix={<MagnifyingGlass />}
                />
            </div>
        </Popover>
    );
};

export default HeaderSkeleton;

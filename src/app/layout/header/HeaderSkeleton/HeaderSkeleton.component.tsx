import './HeaderSkeleton.styles.scss';

import MagnifyingGlass from '@images/header/Magnifying_glass.svg';

import { useState } from 'react';
import TagList from '@components/TagList/TagList.component';
import HeaderContentBlock from '@layout/header/HeaderContentBlock/HeaderContentBlock.component';

import { Input, Popover } from 'antd';

import SearchBlock from '../SearchBlock/SearchBlock.component';

// import { useMemo } from 'react';
// import useMobx from '@stores/root-store';

const tags = ['Історія', '"Україна-Русь"', 'Наукова школа', 'Наука', 'Політика', 'Професор історії'];

const HeaderSkeleton = () => {
    /* const { modalStore: { setIsPageDimmed } } = useMobx();

    const onFocusEvents = useMemo(() => ({
        onFocus: () => setIsPageDimmed(true),
        onBlur: () => setIsPageDimmed(false),
    }), [setIsPageDimmed]);
     */
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 0) {
            handlePopoverVisibleChange(true);
        }
        else
            handlePopoverVisibleChange(false);
    };

    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    return (
        <>
            <Popover
                trigger="click"
                placement="bottomLeft"
                visible={isPopoverVisible}
                content={
                    <div className="headerPopupSkeleton">
                        <SearchBlock searchQuery={searchQuery} />
                    </div>
                }
            >
                <Input
                    onChange={handleInputChange}
                    placeholder="Пошук..."
                    prefix={<MagnifyingGlass />}
                />
            </Popover>
        </>
    );
};

export default HeaderSkeleton;
                                //<div className="leftSide">
                                //    <HeaderContentBlock title="Рекомендації" />
                                //    <h2 className="textHeader">Пошук по тегам</h2>
                                //    <TagList tags={tags} />
                                //</div>
                                //<div className="rightSide">
                                //    <HeaderContentBlock title="Новини" numberOfEls={4} />
                                //</div>
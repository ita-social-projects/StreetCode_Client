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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Popover
            trigger="click"
            placement="bottomLeft"
            content={(
                <div className="headerPopupSkeleton">
                    {searchQuery.length > 0 ? (
                        <SearchBlock searchQuery={searchQuery} />
                    )
                        : (
                            <>
                                <div className="leftSide">
                                    <HeaderContentBlock title="Рекомендації" />
                                    <h2 className="textHeader">Пошук по тегам</h2>
                                    <TagList tags={tags} />
                                </div>
                                <div className="rightSide">
                                    <HeaderContentBlock title="Новини" numberOfEls={4} />
                                </div>

                            </>
                        )}
                </div>
            )}
        >
            <Input
                // size="large"
                onChange={handleInputChange}
                placeholder="Пошук..."
                prefix={<MagnifyingGlass />}
                // {...onFocusEvents}
            />
        </Popover>
    );
};

export default HeaderSkeleton;

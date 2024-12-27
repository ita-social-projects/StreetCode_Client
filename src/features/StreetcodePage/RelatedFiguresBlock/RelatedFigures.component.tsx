/* eslint-disable complexity */
import './RelatedFigures.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx, { useModalContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import ImagesApi from '@/app/api/media/images.api';
import RelatedFigureApi from '@/app/api/streetcode/related-figure.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setShowAllTags: React.Dispatch<React.SetStateAction<boolean>>,
    streetcode?: Streetcode,
}

const RelatedFiguresComponent = ({ setActiveTagId, setShowAllTags, streetcode }: Props) => {
    const { modalStore: { setModal } } = useModalContext();
    const { relatedFiguresStore } = useMobx();
    const { getRelatedFiguresArray } = relatedFiguresStore;
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const windowsize = useWindowSize();

    const [isTouchScreen, setIsTouchScreen] = useState(false);
    const isDesktop = windowsize.width > 1024;
    const isMobile = windowsize.width <= 480;

    useEffect(() => {
        relatedFiguresStore.setSetActiveTagIdFn(setActiveTagId);
        relatedFiguresStore.setSetShowAllTagsFn(setShowAllTags);
    }, [relatedFiguresStore, setActiveTagId, setShowAllTags]);

    useAsync(async () => {
        if (getStreetCodeId === errorStreetCodeId) return;
        const relatedFigures = await RelatedFigureApi.getByStreetcodeId(getStreetCodeId);

        relatedFiguresStore.setInternalRelatedFiguresMap = await Promise.all(
            relatedFigures.map(async (figure) => {
                const image = await ImagesApi.getById(figure.imageId);
                return { ...figure, image };
            }),
        );
        if (streetcode?.tags) {
            relatedFiguresStore.setCurrentStreetcodeTags(streetcode.tags);
        }
    }, [getStreetCodeId]);

    useEffect(() => {
        const onTouchStart = () => {
            setIsTouchScreen(true);
            window.removeEventListener('touchstart', onTouchStart);
        };

        window.addEventListener('touchstart', onTouchStart);

        return () => {
            window.removeEventListener('touchstart', onTouchStart);
        };
    }, []);

    const handleMoreInfoClick = () => {
        if (isDesktop) {
            setModal('relatedFigures', streetcode?.id);
        }
    };

    const renderFigureItem = (figure: RelatedFigure) => (
        <RelatedFigureItem
            key={figure.id}
            relatedFigure={figure}
            hoverable={!isTouchScreen}
        />
    );

    const renderMobileItems = () => {
        const items = [];
        for (let i = 0; i < getRelatedFiguresArray.length; i += 2) {
            const figureOnTopRow = getRelatedFiguresArray[i];
            const figureOnBottomRow = getRelatedFiguresArray[i + 1];

            items.push(
                <div className={figureOnBottomRow ? 'TwoRowSlide' : 'OneRowSlide'} key={i}>
                    <div className="FirstItem">{renderFigureItem(figureOnTopRow)}</div>
                    {figureOnBottomRow && (
                        <div className="SecondItem">{renderFigureItem(figureOnBottomRow)}</div>
                    )}
                </div>,
            );
        }
        return items;
    };

    const sliderProps = {
        className: 'heightContainer',
        infinite: isDesktop,
        swipe: !isDesktop,
        dots: !isDesktop,
        variableWidth: !isDesktop,
        swipeOnClick: false,
        slidesToShow: isDesktop ? 4 : isMobile ? 2 : undefined,
        slidesToScroll: isDesktop ? undefined : isMobile ? 1 : 3,
        rows: 1,
    };

    return getRelatedFiguresArray.length > 0 ? (
        // eslint-disable-next-line max-len
        <div className={`relatedFiguresWrapper container ${getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper'}`}>
            <div className="relatedFiguresContainer">
                <BlockHeading headingText="Зв'язки історії" />
                <div className="relatedFiguresSliderContainer">
                    <BlockSlider {...sliderProps}>
                        {isMobile ? renderMobileItems() : getRelatedFiguresArray.map(renderFigureItem)}
                    </BlockSlider>
                    {getRelatedFiguresArray.length > 4 && (
                        <div className="moreInfo">
                            <p onClick={handleMoreInfoClick}>Дивитися всіх</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default observer(RelatedFiguresComponent);

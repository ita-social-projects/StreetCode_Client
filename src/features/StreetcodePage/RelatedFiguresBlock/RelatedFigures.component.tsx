import './RelatedFigures.styles.scss';

import { observer } from 'mobx-react-lite';
import React from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const RelatedFiguresComponent = ({ setActiveTagId } : Props) => {
    const { modalStore: { setModal } } = useMobx();
    const { relatedFiguresStore, tagsStore, streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useMobx();
    const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;
    const { fetchTagByStreetcodeId } = tagsStore;

    const windowsize = useWindowSize();

    const handleClick = (e: React.MouseEvent) => {
        if (windowsize.width > 1024) {
            setModal('relatedFigures');
        }
    };

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                Promise.all([
                    fetchRelatedFiguresByStreetcodeId(getStreetCodeId),
                    fetchTagByStreetcodeId(getStreetCodeId),
                ]);
            }
        },
        [getStreetCodeId],
    );

    const sliderItems = getRelatedFiguresArray.map((figure) => (
        <RelatedFigureItem
            key={figure.id}
            relatedFigure={figure}
            filterTags
            hoverable
            setActiveTagId={setActiveTagId}
        />
    ));

    const sliderItemsMobile = [];

    for (let i = 0; i < getRelatedFiguresArray.length; i += 2) {
        const figureOnTopRow = getRelatedFiguresArray[i];
        const figureOnBottomRow = getRelatedFiguresArray[i + 1];

        const hasBottomRow = figureOnBottomRow !== undefined;

        const sliderItem = (
            <div className="TwoRowSlide" key={i}>
                <RelatedFigureItem
                    relatedFigure={figureOnTopRow}
                    filterTags
                    hoverable
                    setActiveTagId={setActiveTagId}
                />
                {hasBottomRow && (
                    <RelatedFigureItem
                        relatedFigure={figureOnBottomRow}
                        filterTags
                        hoverable
                        setActiveTagId={setActiveTagId}
                    />
                )}
            </div>
        );

        sliderItemsMobile.push(sliderItem);
    }

    const sliderProps = {
        className: 'heightContainer',
        infinite: windowsize.width > 1024,
        swipe: windowsize.width <= 1024,
        dots: windowsize.width <= 1024,
        variableWidth: windowsize.width <= 1024,
        swipeOnClick: false,
        slidesToShow: windowsize.width > 1024 ? 4 : windowsize.width <= 480 ? 2 : undefined,
        slidesToScroll: windowsize.width > 1024 ? undefined : windowsize.width <= 480 ? 1 : 3,
        rows: 1,
    };

    return (
        getRelatedFiguresArray.length > 0
            ? (
                <div className={`relatedFiguresWrapper container
            ${(getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
                >
                    <div className="relatedFiguresContainer">
                        <BlockHeading headingText="Зв'язки історії" />
                        <div className="headingWrapper">
                            <div className="moreInfo">
                                <p onClick={(e) => handleClick(e)}>
                            Дивитися всіх
                                </p>
                            </div>
                        </div>
                        <div className="relatedFiguresSliderContainer">
                            <BlockSlider {...sliderProps}>
                                {windowsize.width > 480 ? sliderItems : sliderItemsMobile}
                            </BlockSlider>
                        </div>
                    </div>
                </div>
            ) : <></>
    );
};

export default observer(RelatedFiguresComponent);

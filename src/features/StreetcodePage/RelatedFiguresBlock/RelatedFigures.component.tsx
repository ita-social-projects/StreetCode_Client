/* eslint-disable complexity */
import './RelatedFigures.styles.scss';

import { observer } from 'mobx-react-lite';
import React from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useModalContext, useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import ImagesApi from '@/app/api/media/images.api';
import RelatedFigureApi from '@/app/api/streetcode/related-figure.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const RelatedFiguresComponent = ({ setActiveTagId } : Props) => {
    const { modalStore: { setModal } } = useModalContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { relatedFiguresStore } = useMobx();
    const { getRelatedFiguresArray } = relatedFiguresStore;

    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
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
                    RelatedFigureApi.getByStreetcodeId(getStreetCodeId)
                        .then((res) => {
                            Promise.all(res.map((f, index) => ImagesApi.getById(f.imageId).then((img) => {
                                res[index].image = img;
                            }))).then(() => {
                                relatedFiguresStore.setInternalRelatedFiguresMap = res;
                                streecodePageLoaderContext.addBlockFetched();
                            });
                        })]);
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
                        <div className="relatedFiguresSliderContainer">
                            <BlockSlider {...sliderProps}>
                                {windowsize.width > 480 ? sliderItems : sliderItemsMobile}
                            </BlockSlider>
                            {getRelatedFiguresArray.length > 4 && (
                                <div className="moreInfo">
                                    <p onClick={(e) => handleClick(e)}>
                                    Дивитися всіх
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : <></>
    );
};

export default observer(RelatedFiguresComponent);

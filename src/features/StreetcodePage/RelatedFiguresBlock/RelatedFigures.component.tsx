import './RelatedFigures.styles.scss';

import React from 'react';
import BlockSlider from '@features/SlickSlider/RelatedFiguresSlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const RelatedFiguresComponent = ({ setActiveTagId } : Props) => {
    const { modalStore: { setModal } } = useMobx();
    const { relatedFiguresStore, tagsStore } = useMobx();
    const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;
    const { fetchTagByStreetcodeId } = tagsStore;

    const streetcodeId = useRouteId();

    const windowsize = useWindowSize();

    const handleClick = () => {
        if (windowsize.width > 1024) {
            setModal('relatedFigures', streetcodeId, true)
        }
    }

    useAsync(
        () => Promise.all([
            fetchRelatedFiguresByStreetcodeId(streetcodeId),
            fetchTagByStreetcodeId(streetcodeId),
        ]),
        [streetcodeId],
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

    const sliderProps = {
        className: "heightContainer",
        infinite: windowsize.width > 1024,
        swipe: windowsize.width <= 1024,
        dots: windowsize.width <= 1024,
        variableWidth: windowsize.width <= 1024,
        swipeOnClick: false,
        slidesToShow: windowsize.width > 1024 ? 4 : windowsize.width <= 480 ? 2 : undefined,
        slidesToScroll: windowsize.width > 1024 ? undefined : windowsize.width <= 480 ? 1 : 3,
        rows: windowsize.width <= 480 ? 2 : 1
    }; 

    return (
        <div className={`relatedFiguresWrapper
            ${(getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
        >
            <div className="relatedFiguresContainer">
                <BlockHeading headingText="Зв'язки історії" />
                <div className="headingWrapper">
                    <div className="moreInfo">
                        <p onClick={handleClick}>
                            Дивитися всіх
                        </p>
                    </div>
                </div>
                <div className="relatedFiguresSliderContainer">
                <BlockSlider {...sliderProps}>   
                    {sliderItems}
                </BlockSlider>
                </div>
            </div>
        </div>
    );
};

export default RelatedFiguresComponent;
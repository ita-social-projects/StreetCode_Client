import './RelatedFigures.styles.scss';

import React from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
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

    const sliderPropsDesktop = {
        className: "heightContainer",
        infinite: true,
        swipe: false,
        dots: false,
        slidesToShow: 4,
        swipeOnClick: false
    }; 
    const sliderPropsTablet = {
        className: "heightContainer",
        infinite: false,
        swipe: true,
        dots: true,
        swipeOnClick: false,
        variableWidth: true,
        slidesToScroll: 3
    };
    const sliderPropsMobile = {
        className: "heightContainer",
        infinite: false,
        swipe: true,
        dots: true,
        swipeOnClick: false,
        variableWidth: true,
        slidesToScroll: 1,
        slidesToShow: 2,
        rows: 2
    };

    return (
        <div className={`relatedFiguresWrapper
            ${(getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
        >
            <div className="relatedFiguresContainer">
                <div className="headingWrapper">
                    <BlockHeading headingText="Зв'язки історії" />
                    <div className="moreInfo">
                        <p onClick={handleClick}>
                            Дивитися всіх
                        </p>
                    </div>
                </div>
                <div className="relatedFiguresSliderContainer">
                {windowsize.width > 1024 ? 
                    <BlockSlider {...sliderPropsDesktop}>   
                        {sliderItems}
                    </BlockSlider>
                    : windowsize.width > 480 ?
                    <BlockSlider {...sliderPropsTablet}>
                        {sliderItems}
                    </BlockSlider>
                    :
                    <BlockSlider {...sliderPropsMobile}>
                        {sliderItems}
                    </BlockSlider>
                    }
                </div>
            </div>
        </div>
    );
};

export default RelatedFiguresComponent;

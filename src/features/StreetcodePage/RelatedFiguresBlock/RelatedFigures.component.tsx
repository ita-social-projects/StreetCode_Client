import './RelatedFigures.styles.scss';

import { observer } from 'mobx-react-lite';
import React from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

interface Props {
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const RelatedFiguresComponent = ({ setActiveTagId } : Props) => {
    const { modalStore: { setModal } } = useMobx();
    const { relatedFiguresStore, tagsStore, streetcodeStore: { getStreetCodeId } } = useMobx();
    const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;
    const { fetchTagByStreetcodeId } = tagsStore;

    const streetcodeId = useRouteId();

    useAsync(
        () => Promise.all([
            fetchRelatedFiguresByStreetcodeId(getStreetCodeId ?? 1),
            fetchTagByStreetcodeId(getStreetCodeId ?? 1),
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

    return (
        <div className={`relatedFiguresWrapper
            ${(getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
        >
            <div className="relatedFiguresContainer">
                <div className="headingWrapper">
                    <BlockHeading headingText="Зв'язки історії" />
                    <div className="moreInfo">
                        <p onClick={() => setModal('relatedFigures', getStreetCodeId, true)}>
                            Дивитися всіх
                        </p>
                    </div>
                </div>
                <div className="relatedFiguresSliderContainer">
                    <BlockSlider
                        className="heightContainer"
                        infinite={true}
                        slidesToShow={4}
                        swipe={false}
                        dots={false}
                        swipeOnClick={false}
                    >
                        {sliderItems}
                    </BlockSlider>
                </div>
            </div>
        </div>
    );
};

export default observer(RelatedFiguresComponent);

import './RelatedFigures.styles.scss';

import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

const RelatedFiguresComponent = () => {
    const { modalStore: { setModal } } = useMobx();
    const { relatedFiguresStore, tagsStore } = useMobx();
    const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;
    const { fetchTagByStreetcodeId } = tagsStore;

    const streetcodeId = useRouteId();

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
        />
    ));

    return (
        <div
            id="relatedFigures"
            className={`relatedFiguresWrapper ${(getRelatedFiguresArray.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
        >
            <div className="relatedFiguresContainer">
                <BlockHeading headingText="Зв'язки історії" />
                <div className="relatedFiguresSliderContainer">
                    <div style={{ height: '100%' }}>
                        <SlickSlider
                            className="heightContainer"
                            infinite={false}
                            slidesToShow={4}
                            slides={sliderItems}
                            swipe={false}
                            dots={false}
                            swipeOnClick={false}
                        />
                    </div>
                </div>
                <div className="moreInfo">
                    <p onClick={() => setModal('relatedFigures', streetcodeId, true)}>
                        Дивитися всіх
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RelatedFiguresComponent;

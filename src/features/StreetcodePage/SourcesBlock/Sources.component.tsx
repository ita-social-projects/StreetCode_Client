import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import SourceItem from './SourceItem/SourceItem.component';

const SourcesComponent = () => {
    const { sourcesStore, streetcodeStore: { getStreetCodeId } } = useMobx();
    const { fetchSrcCategoriesByStreetcodeId, getSrcCategoriesArray } = sourcesStore;

    useAsync(
        () => fetchSrcCategoriesByStreetcodeId(getStreetCodeId ?? 1),
        [getStreetCodeId],
    );

    return (
        <div className="sourcesWrapper">
            <div className="sourcesContainer">
                <BlockHeading headingText="Для фанатів" />
                <div className="sourceContentContainer">
                    <div className="sourcesSliderContainer">
                        <BlockSlider
                            infinite={false}
                            swipe={false}
                            dots={false}
                        >
                            {getSrcCategoriesArray.flatMap((i) => [i, i]).map((sc) => (
                                <SourceItem
                                    key={sc.id}
                                    srcCategory={sc}
                                />
                            ))}
                        </BlockSlider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(SourcesComponent);

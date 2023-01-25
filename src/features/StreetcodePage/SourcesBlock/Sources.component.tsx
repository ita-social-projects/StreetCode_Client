import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import SourceItem from './SourceItem/SourceItem.component';

const SourcesComponent = () => {
    const { sourcesStore } = useMobx();
    const { fetchSrcCategoriesByStreetcodeId, getSrcCategoriesArray } = sourcesStore;

    const streetcodeId = useRouteId();
    useAsync(
        () => fetchSrcCategoriesByStreetcodeId(streetcodeId),
        [streetcodeId],
    );
    return (
        <div
            className="sourcesWrapper"
        >
            <div className="sourcesContainer">
                <BlockHeading headingText="Для фанатів" />
                <div className="sourceContentContainer">
                    <div className="sourcesSliderContainer">
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots={false}
                            slides={getSrcCategoriesArray.flatMap((i) => [i, i]).map((sc) => (
                                <SourceItem
                                    key={sc.id}
                                    srcCategory={sc}
                                />
                            ))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(SourcesComponent);

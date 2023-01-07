import "./Sources.styles.scss";

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import SourceItem from "./SourceItem/SourceItem.component";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import useMobx from '@stores/root-store';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useParams } from 'react-router-dom';

const SourcesComponent = () => {
    const { sourcesStore } = useMobx();
    const { fetchSrcCategoriesByStreetcodeId, getSrcCategoriesArray } = sourcesStore;

    const { id: streetcodeId } = useParams<{ id: string }>();
    useAsync(() => fetchSrcCategoriesByStreetcodeId(parseInt(streetcodeId ?? '1')));

    return (
        <>
            <div className={"sourcesWrapper"}>
                <div className={"sourcesContainer"}>
                    <BlockHeading headingText={"Для фанатів"} />
                    <div className={"sourceContentContainer"}>
                        <div className={"sourcesSliderContainer"}>
                            <SlickSlider
                                swipeOnClick={false}
                                swipe={false}
                                dots={false}
                                slides={getSrcCategoriesArray.flatMap(i => [i, i]).map(sc => (
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
        </>
    );
}

export default SourcesComponent;
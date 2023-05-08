import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import SourceItem from './SourceItem/SourceItem.component';

const SourcesComponent = () => {
    const { sourcesStore, streetcodeStore: { getStreetCodeId } } = useMobx();
    const windowsize = useWindowSize();
    useAsync(() => sourcesStore.fetchSrcCategoriesByStreetcodeId(getStreetCodeId), [getStreetCodeId]);
    const sliderProps = {
        className: 'heightContainer',
        infinite: true,
        swipe: windowsize.width <= 1024,
        dots: windowsize.width <= 1024,
        variableWidth: windowsize.width <= 1024,
        swipeOnClick: false,
        slidesToShow: windowsize.width >= 1024 ? undefined : windowsize.width < 1024 ? 1 : 2,
        slidesToScroll: windowsize.width >= 1024 ? undefined : windowsize.width < 1024 ? 1 : 2,
        rows: 1,
        initialSlide: 1,
        centerMode: windowsize.width < 1024,
    };
    return (
        <div className={`sourcesWrapper 
            ${sourcesStore.getSrcCategoriesArray.length? '' : 'display-none'}`}
        >
            <div className="sourcesContainer">
                <BlockHeading headingText="Для фанатів" />
                <div className="sourceContentContainer">
                    <div className="sourcesSliderContainer">
                        <BlockSlider
                            {...sliderProps}
                        >
                            {sourcesStore.getSrcCategoriesArray.map((sc) => (
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

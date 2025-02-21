/* eslint-disable max-len */
import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx, { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

import SourceItem from './SourceItem/SourceItem.component';

const SourcesComponent = () => {
    const { sourcesStore } = useMobx();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const windowsize = useWindowSize();

    useEffect(() => {
        const streetcodeId = getStreetCodeId;
        if (streetcodeId > 0) {
            sourcesStore.fetchSrcCategoriesByStreetcodeId(streetcodeId)
                .then(() => streecodePageLoaderContext.addBlockFetched(StreetcodeBlock.Sources));
        }
    }, [getStreetCodeId]);

    const sliderProps = {
        className: 'heightContainer',
        infinite: false,
        swipe: true,
        touchThreshold: 25,
        dots: windowsize.width <= 1024,
        variableWidth: true,
        swipeOnClick: false,
        slidesToShow: windowsize.width > 1300 ? 3 : (windowsize.width > 829 || windowsize.width < 769 && windowsize.width > 559 ? 2 : 1),
        slidesToScroll: 1,
        rows: 1,
        initialSlide: 0,
        centerMode: false,
        centerPadding: windowsize.width < 768 ? '10px' : '30px',
    };
    const sliderItems = sourcesStore.getSrcCategoriesArray.map((sc) => (
        <SourceItem
            key={`${sc.id}${sc.streetcodeId}`}
            srcCategory={sc}
        />
    ));

    return sourcesStore.getSrcCategoriesArray.length > 0 ? (
        <div className="sourcesWrapper">
            <div className="sourcesContainer">
                <BlockHeading headingText="Для фанатів" />
                <div className="sourceContentContainer">
                    <div className={sourcesStore.getSrcCategoriesArray.length > 3 ? 'sourcesSliderContainerBig' : 'sourcesSliderContainerSmall'}>
                        <SlickSlider {...sliderProps}>{sliderItems}</SlickSlider>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};
export default observer(SourcesComponent);

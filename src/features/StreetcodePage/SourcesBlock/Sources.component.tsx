import './Sources.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import SourceItem from './SourceItem/SourceItem.component';

const SourcesComponent = () => {
    const { sourcesStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const windowsize = useWindowSize();
    useEffect(() => {
        const streetcodeId = getStreetCodeId;
        if (streetcodeId > 0) {
            sourcesStore.fetchSrcCategoriesByStreetcodeId(streetcodeId);
        }
    }, [getStreetCodeId]);
    const sliderProps = {
        className: 'heightContainer',
        infinite: true,
        swipe: windowsize.width <= 1200,
        dots: windowsize.width <= 1024,
        variableWidth: windowsize.width <= 1200,
        swipeOnClick: false,
        slidesToShow: windowsize.width >= 1200 ? undefined : windowsize.width < 1200 ? 1 : 2,
        slidesToScroll: windowsize.width >= 1200 ? undefined : windowsize.width < 1200 ? 1 : 2,
        rows: 1,
        initialSlide: 1,
        centerMode: windowsize.width < 1200,
        centerPadding: windowsize.width < 768 ? '10px' : '30px',
    };
    return (sourcesStore.getSrcCategoriesArray.length > 0
        ? (
            <div className="sourcesWrapper container">

                <div className="sourcesContainer">
                    <BlockHeading headingText="Для фанатів" />
                    <div className="sourceContentContainer">
                        <div className="sourcesSliderContainer">
                            <BlockSlider
                                {...sliderProps}
                            >
                                {sourcesStore.getSrcCategoriesArray.map((sc) => (
                                    <SourceItem
                                        key={`${sc.id}${sc.streetcodeId}`}
                                        srcCategory={sc}
                                    />
                                ))}
                            </BlockSlider>
                        </div>
                    </div>
                </div>
            </div>
        )
        : <></>);
};

export default observer(SourcesComponent);

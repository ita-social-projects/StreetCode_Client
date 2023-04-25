import './Sources.styles.scss';
import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import SourceItem from './SourceItem/SourceItem.component';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const SourcesComponent = () => {
  const { sourcesStore, streetcodeStore: { getStreetCodeId } } = useMobx();
  const { fetchSrcCategoriesByStreetcodeId, getSrcCategoriesArray } = sourcesStore;

  const windowsize = useWindowSize();
  const showDots = windowsize.width <= 1024;

  useAsync(() => fetchSrcCategoriesByStreetcodeId(getStreetCodeId), [getStreetCodeId]);
  return (
    <div className="sourcesWrapper">
      <div className="sourcesContainer">
        <BlockHeading headingText="Для фанатів" />
        <div className="sourceContentContainer">
          <div className="sourcesSliderContainer">
          <BlockSlider infinite={false} swipe={false} dots={showDots} initialSlide={0}>
  {getSrcCategoriesArray.flatMap((i) => [i, i]).map((sc) => (
    <SourceItem key={sc.id} srcCategory={sc} />
  ))}
</BlockSlider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(SourcesComponent);

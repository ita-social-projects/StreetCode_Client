import './SourceItem.styles.scss';

import { useMobx } from '@stores/root-store';
import { observer } from 'mobx-react-lite';

interface Props {
    text: string;
}

const SourceItem = (props: Props) => {
    const { sourcesStore: { openModal } } = useMobx();

    return (
      <div className="sourcesSliderItem" onClick={openModal}>
        <h1>{props.text}</h1>
      </div>
    );
};

export default observer(SourceItem);

import './SourceItem.styles.scss';

import useMobx from '@stores/root-store';
import { observer } from 'mobx-react-lite';
import { SourceCategory } from '@models/sources/sources.model';

interface Props {
    srcCategory: SourceCategory;
}

const SourceItem = ({ srcCategory: { id, image, title } }: Props) => {
    const { modalStore: { setModal } } = useMobx();

    return (
        <div
            className='sourcesSliderItem'
            onClick={() => setModal('sources', id, true)}
            style={{backgroundImage: `url(${image?.url.href})`}}
        >
            <h1>{title}</h1>
        </div>
    );
}

export default observer(SourceItem);
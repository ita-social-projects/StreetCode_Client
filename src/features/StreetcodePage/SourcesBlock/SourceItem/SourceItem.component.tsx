import './SourceItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { SourceCategory } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    srcCategory: SourceCategory;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const { id, image, title } = srcCategory;

    return (
        <div
            className="sourcesSliderItem"
            onClick={() => setModal('sources', id)}
            style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
        >
            <h1>{title}</h1>
        </div>
    );
};

export default observer(SourceItem);

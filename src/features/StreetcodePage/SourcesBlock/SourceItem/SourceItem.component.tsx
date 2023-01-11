import './SourceItem.styles.scss';

import { HTMLAttributes } from 'react';

import { observer } from 'mobx-react-lite';

import useMobx from '@stores/root-store';
import { SourceCategory } from '@models/sources/sources.model';


interface Props extends HTMLAttributes<HTMLDivElement> {
    srcCategory: SourceCategory;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { modalStore: { setModal } } = useMobx();
    const { id, image, title } = srcCategory;

    return (
        <div
            className='sourcesSliderItem'
            onClick={() => setModal('sources', id)}
            style={{backgroundImage: `url(${image?.url.href})`}}
        >
            <h1>{title}</h1>
        </div>
    );
}

export default observer(SourceItem);
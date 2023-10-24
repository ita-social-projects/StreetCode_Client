import './SourceItem.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { SourceCategory } from '@models/sources/sources.model';
import { useModalContext } from '@stores/root-store';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    srcCategory: SourceCategory;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { modalStore: { setModal } } = useModalContext();
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(false);
    };

    const handleMouseMove = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        if (!isDragging) {
            setModal('sources', srcCategory.id, true);
        }
    };

    return (
        <div
            className="sourcesSliderItem"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
                backgroundImage: `url(${base64ToUrl(srcCategory.image?.base64, srcCategory.image?.mimeType)})`,
                filter: 'grayscale(100%)',
            }}
        >
            <h1>{srcCategory.title}</h1>
        </div>
    );
};

export default observer(SourceItem);

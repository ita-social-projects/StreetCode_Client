import './TagsListModal.styles.scss';

import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

interface Props {
    streetCodeid: number,
    activeTagId: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const TagListModal = ({ streetCodeid, activeTagId, setActiveTagId }: Props) => {
    const { tagsStore } = useMobx();
    const { fetchTagByStreetcodeId, getTagArray } = tagsStore;

    useAsync(() => {
        fetchTagByStreetcodeId(streetCodeid);
    });

    return (
        <div className="tagModalContainer">
            <BlockSlider
                infinite={false}
                slidesToShow={3}
                swipe={false}
                dots={false}
                swipeOnClick
                variableWidth
                centerMode
                initialSlide={getTagArray.length}
                slidesToScroll={1}
            >
                {getTagArray?.map((tag) => (
                    <div>
                        <Button
                            className={`tagModalItem ${tag.id === activeTagId ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTagId(tag.id);
                            }}
                            key={tag.id}
                        >
                            {tag.title}
                        </Button>
                    </div>
                ))}
            </BlockSlider>
        </div>
    );
};

export default TagListModal;

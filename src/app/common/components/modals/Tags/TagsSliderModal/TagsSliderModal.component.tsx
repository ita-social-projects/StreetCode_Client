import './TagsSliderModal.styles.scss';

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
                className="tagSliderClass"
                infinite={false}
                slidesToShow={1}
                swipe={false}
                dots={false}
                variableWidth
                arrows={false}
                focusOnSelect
                centerMode
                centerPadding="0"
                slidesToScroll={1}
                initialSlide={5}
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

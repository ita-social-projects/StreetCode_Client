import './TagsSliderModal.styles.scss';

import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

interface Props {
    streetCodeid: number,
    activeTagId: number,
    activeTagBlock: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const TagListModal = ({ streetCodeid, activeTagId, activeTagBlock, setActiveTagId }: Props) => {
    const { tagsStore } = useMobx();
    const { fetchTagByStreetcodeId, getTagArray } = tagsStore;

    useAsync(() => {
        fetchTagByStreetcodeId(streetCodeid);
    });

    return (
        <div className="tagModalContainer">
            <BlockSlider
                className="tagSliderClass"
                infinite
                slidesToShow={3}
                swipe={false}
                dots={false}
                variableWidth
                arrows={false}
                focusOnSelect
                centerMode
                centerPadding="0"
                slidesToScroll={1}
                initialSlide={activeTagBlock}
            >
                {getTagArray?.map((tag) => (
                    <div>
                        <Button
                            className="tagModalItem"
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

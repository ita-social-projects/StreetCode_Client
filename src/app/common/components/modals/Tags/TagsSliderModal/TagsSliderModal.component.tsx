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

const TagsSliderModal = ({ streetCodeid, activeTagId, activeTagBlock, setActiveTagId }: Props) => {
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
                arrows={false}
                swipe={false}
                dots={false}
                swipeOnClick
                variableWidth
                centerMode
                slidesToScroll={1}
                initialSlide={activeTagBlock}
                focusOnSelect
                centerPadding="0"
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

export default TagsSliderModal;

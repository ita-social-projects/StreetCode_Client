import './TagsSliderModal.styles.scss';

import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

interface Props {
    streetCodeid: number,
    activeTagId: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    showAllTags: boolean
}

const TagsSliderModal = ({ streetCodeid, activeTagId, setActiveTagId, showAllTags = false }: Props) => {
    const { tagsStore } = useMobx();
    const { fetchTagByStreetcodeId, fetchAllTags, getTagArray, getAllTagsArray } = tagsStore;

    useAsync(
        () => {
            fetchTagByStreetcodeId(streetCodeid);
            fetchAllTags();
        },
        [streetCodeid],
    );

    const tags = getTagArray?.map((tag) => (
        <div key={tag.id}>
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
    ));

    const allTags = getAllTagsArray?.map((tag) => (
        <div key={tag.id}>
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
    ));

    const initialSlide = showAllTags
        ? getAllTagsArray.findIndex((tag) => tag.id === activeTagId)
        : getTagArray.findIndex((tag) => tag.id === activeTagId);

    const sliderProps = {
        className: 'tagSliderClass',
        infinite: false,
        slidesToShow: 1,
        arrows: false,
        swipe: false,
        dots: false,
        variableWidth: true,
        centerMode: true,
        slidesToScroll: 1,
        initialSlide,
        focusOnSelect: true,
        beforeChange: (currentSlide: number, nextSlide: number) => setActiveTagId(getAllTagsArray[nextSlide].id),
    };

    return (
        <div className="tagModalContainer">
            {showAllTags && (allTags.length > 1
                ? (
                    <BlockSlider
                        {...sliderProps}
                    >
                        {allTags}
                    </BlockSlider>
                ) : (
                    <div>
                        {allTags}
                    </div>
                ))}
            {!showAllTags && (tags.length > 1
                ? (
                    <BlockSlider
                        {...sliderProps}
                    >
                        {tags}
                    </BlockSlider>
                ) : (
                    <div>
                        {tags}
                    </div>
                ))}
        </div>
    );
};

export default TagsSliderModal;

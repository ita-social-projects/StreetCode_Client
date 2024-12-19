import './TagsSliderModal.styles.scss';

import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useEffect, useState } from 'react';
import Tag from '@/models/additional-content/tag.model';

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
            if(streetCodeid) fetchTagByStreetcodeId(streetCodeid);
            if(showAllTags) fetchAllTags();
        },
        [streetCodeid, showAllTags],
    );

    const renderTags = (tagsArray: Tag[]) => tagsArray.map((tag) => (
        <div key={tag.id}>
            <Button
                className="tagModalItem"
                onClick={() => setActiveTagId(tag.id)}
            >
                {tag.title}
            </Button>
        </div>
      ));
    
    const tags = renderTags(getTagArray);
    const allTags = renderTags(getTagArray);

    const [initialSlide, setInitialSlide] = useState<number | undefined>(undefined);
    const [hasSetInitialSlide, setHasSetInitialSlide] = useState(false);

    useEffect(() => {
        if (hasSetInitialSlide) return;
    
        const tagsArray = showAllTags ? getAllTagsArray : getTagArray;
    
        if (tagsArray.length > 0) {
            const slideIndex = tagsArray.findIndex((tag) => tag.id === activeTagId);
            
            if (slideIndex !== undefined && slideIndex !== -1) {
                setInitialSlide(slideIndex); 
                setHasSetInitialSlide(true); 
            }
        }
    }, [tags]);

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
        beforeChange: (currentSlide: number, nextSlide: number) => {
            const newTagId = getAllTagsArray[nextSlide]?.id;
            if (newTagId) setActiveTagId(newTagId);
        },
    };

    return (
        <div className="tagModalContainer">
            {showAllTags && (allTags.length > 1
                ? (
                    <BlockSlider key={initialSlide}
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
                    <BlockSlider key={initialSlide}
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

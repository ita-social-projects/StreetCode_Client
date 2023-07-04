import './TagsSliderModal.styles.scss';

import { useEffect, useState } from 'react';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

interface Props {
    streetCodeid: number,
    activeTagBlock: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const TagsSliderModal = ({ streetCodeid, activeTagBlock, setActiveTagId }: Props) => {
    const { tagsStore } = useMobx();
    const { fetchTagByStreetcodeId, getTagArray } = tagsStore;

    useEffect(() => {
        fetchTagByStreetcodeId(streetCodeid);
    }, [streetCodeid, getTagArray]);

    return (
        <div className="tagModalContainer">
            { getTagArray.length > 1
                ? (
                    <BlockSlider
                        className="tagSliderClass"
                        infinite={false}
                        slidesToShow={1}
                        arrows={false}
                        swipe={false}
                        dots={false}
                        variableWidth
                        centerMode
                        slidesToScroll={1}
                        initialSlide={activeTagBlock}
                        focusOnSelect
                    >
                        {getTagArray?.map((tag) => (
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
                        ))}
                    </BlockSlider>
                ) : (
                    <div>
                        {getTagArray?.map((tag) => (
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
                        ))}
                    </div>
                )}
        </div>
    );
};

export default TagsSliderModal;

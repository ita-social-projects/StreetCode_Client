import './RelatedFigureItem.styles.scss';

import Tag from '@models/additional-content/tag.model';

interface Props {
    id: number;
    textContent: string;
    imgSrc: string;
    tags: Tag[];
}

const redirectOnStreetcode = (id: number) => {
    console.warn(`redirected to streetcode with id: ${id}`);
};

const RelatedFigureSliderItem = ({ id, imgSrc, tags, textContent }: Props) => (
    <div
        className="relatedFigureSlide"
        style={{ backgroundImage: `url(${imgSrc})` }}
        onClick={() => {
            redirectOnStreetcode(id);
        }}
    >
        <div className="slideText">
            <h3 className="heading">
                {textContent}
            </h3>
            <div className="relatedTagList">
                {tags.map((tag, idx) => (
                    <div key={idx} className="tag">
                        <p>{tag.title}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default RelatedFigureSliderItem;

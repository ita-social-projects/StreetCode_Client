import './RelatedFigureItem.styles.scss';

import { Link } from 'react-router-dom';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';

interface Props {
    relatedFigure: RelatedFigure;
    filterTags?: boolean;
    hoverable?: boolean;
}

const RelatedFigureItem = ({ relatedFigure, filterTags = true, hoverable = false }: Props) => {
    const { id, imageId, title, tags } = relatedFigure;

    const { imagesStore, tagsStore: { getTagArray } } = useMobx();
    const { fetchImage, getImage } = imagesStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );
    
    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);

    return (
        <Link
            className={`relatedFigureSlide 
                ${hoverable && tags.length > 1 ? 'hoverable' : ''}
                ${hoverable && tags.length > 1 && totalLength < 27 ? 'single_row' : ''}`} 

            style={{ backgroundImage: `url(${getImage(imageId)?.url.href})` }}
            to={`../streetcode/${id}`}
        >
            <div className="figureSlideText">
                <div className="heading">
                    <p>
                        {title}
                    </p>
                </div>
                <div className={`relatedTagList`}>
                    {tags.filter((tag) => getTagArray.find((ti) => ti.id === tag.id || !filterTags))
                        .map((tag) => (
                            <div key={tag.id} className="tag">
                                <p>{tag.title}</p>
                            </div>
                        ))}
                </div>
            </div>
        </Link>
    );
};

export default RelatedFigureItem;

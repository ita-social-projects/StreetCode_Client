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

    const { imagesStore, tagsStore: { getTagArray }, modalStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { setModal } = modalStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );

    return (
        <Link
            className={`relatedFigureSlide ${hoverable ? 'hoverable' : ''}`}
            style={{ backgroundImage: `url(${getImage(imageId)?.url.href})` }}
            to={`../streetcode/${id}`}
            onClick={() => {
                setModal('tagsList');
            }}
        >
            <div className="figureSlideText">
                <div className="heading">
                    <p>
                        {title}
                    </p>
                </div>
                <div className="relatedTagList">
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

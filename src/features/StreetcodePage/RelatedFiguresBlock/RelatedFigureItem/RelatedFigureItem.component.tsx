import './RelatedFigureItem.styles.scss';

import { Link } from 'react-router-dom';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';

interface Props {
    relatedFigure: RelatedFigure;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>;
    filterTags?: boolean;
    hoverable?: boolean;
}

const RelatedFigureItem = ({ relatedFigure, setActiveTagId, filterTags = true, hoverable = false }: Props) => {
    const { id, imageId, title, tags } = relatedFigure;

    const { imagesStore, tagsStore: { getTagArray }, modalStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { setModal, modalsState: {tagsList} } = modalStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );

    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);

    return (
        <Link
            className={`relatedFigureSlide 
            ${hoverable && tags.length > 1 ? 'hoverable' : ''} 
            ${hoverable && tags.length > 1 && totalLength < 27 ? 'single_row' : ''}`} // 1 => 0
            style={{ backgroundImage: `url(${getImage(imageId)?.url.href})` }}
            to={`../streetcode/${id}`}
            onClick={() => {
                if (!tagsList) {
                    setModal('tagsList');
                }
            }}
        >
            <div className="figureSlideText">
                <div className="heading">
                    <p>
                        {title}
                    </p>
                </div>
                <div className={`relatedTagList ${tags.length > 1 ? '' : 'noneTags'}`}>

                    {tags.filter((tag) => getTagArray.find((ti) => ti.id === tag.id || !filterTags))
                        .map((tag) => (
                            <button
                                type="button"
                                key={tag.id}
                                className="tag"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setModal('tagsList');
                                    setActiveTagId(tag.id);
                                }}
                            >
                                <p>{tag.title}</p>
                            </button>
                        ))}
                </div>
            </div>
        </Link>
    );
};

export default RelatedFigureItem;

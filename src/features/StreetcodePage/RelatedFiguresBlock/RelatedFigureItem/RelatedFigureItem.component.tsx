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
    const { id, imageId, title, tags, alias } = relatedFigure;

    const { imagesStore, tagsStore: { getTagArray }, modalStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { setModal, modalsState: { tagsList } } = modalStore;

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
        >
            <div className="figureSlideText">
                <div className="heading"> 
                    <p>
                        {title}
                    </p>
                    {
                        alias !== undefined ?
                        <p className='aliasText'>
                            ({alias})
                        </p>
                        : 
                        <p className='aliasText'>
                            (псевдонім)
                        </p>
                    }
                </div>
                <div className={`relatedTagList ${tags.length > 1 ? '' : 'noneTags'}`}>

                    {tags.filter((tag) => getTagArray.find((ti) => ti.id === tag.id || !filterTags))
                        .map((tag) => (
                            <button
                                key={tag.id}
                                className="tag"
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (!tagsList.isOpen) {
                                        setModal('tagsList');
                                    }
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

import './RelatedFigureItem.styles.scss';

import { Link } from 'react-router-dom';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

interface Props {
    relatedFigure: RelatedFigure;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>;
    filterTags?: boolean;
    hoverable?: boolean;
}

const RelatedFigureItem = ({ relatedFigure, setActiveTagId, filterTags = true, hoverable = false }: Props) => {
    const {
        id, imageId, title, tags, alias, url
    } = relatedFigure;

    const { imagesStore, tagsStore: { getTagArray }, modalStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { setModal, modalsState: {tagsList} } = modalStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );

    const handleClick = () => {
        if (windowsize.width <= 1024) {
            setModal('relatedFigureItem', id, true);
        }
    }

    const windowsize = useWindowSize(); 

    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);

    return (
        <>
          { windowsize.width > 1024 && (
            <Link
                className={`relatedFigureSlide 
                ${hoverable && tags.length > 1 ? 'hoverable' : undefined} 
                ${hoverable && tags.length > 1 && totalLength < 27 ? 'single_row' : undefined}`}

                style={{ backgroundImage: `url(${base64ToUrl(getImage(imageId)?.base64, getImage(imageId)?.mimeType)})` }}
                to={`../streetcode/${url}`}
                state={window.scrollTo(0,0)}
                onClick={() => {
                    if (!tagsList) {
                        setModal('tagsList');
                    }
                }}
            >
                <div className="figureSlideText">
                    <div className="heading"> 
                        <p>{title}</p>
                        {
                            alias !== null ?
                            <p className='aliasText'>
                                ({alias})
                            </p>
                            : undefined
                        }
                    </div>
                    <div className={`relatedTagList ${tags.length > 1 ? undefined : 'noneTags'}`}>
                        {tags.filter((tag) => getTagArray.find((ti) => 
                            ti.id === tag.id || !filterTags))
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
            </Link>)}
            { windowsize.width <= 1024 && (<>
            <div className='relatedFigureSlide'
                style={{ backgroundImage: `url(${base64ToUrl(getImage(imageId)?.base64, getImage(imageId)?.mimeType)})` }}
                onClick={handleClick}
            >
            </div>
            <div className="figureSlideText mobile">
                <div className="heading"> 
                    <p>{title}</p>
                    {
                        alias !== null ?
                        <p className='aliasText'>
                            ({alias})
                        </p>
                        : undefined
                    }
                </div>
            </div>
            </>)}
        </>
    );
};

export default RelatedFigureItem;
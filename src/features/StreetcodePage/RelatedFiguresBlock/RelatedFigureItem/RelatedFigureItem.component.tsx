/* eslint-disable complexity */
import './RelatedFigureItem.styles.scss';

import { Link } from 'react-router-dom';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx, { useModalContext } from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { relatedFiguresLeaveEvent, relatedFiguresTagsEvent } from '@/app/common/utils/googleAnalytics.unility';
import Streetcode from '@/models/streetcode/streetcode-types.model';

interface Props {
    relatedFigure: RelatedFigure;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>;
    filterTags?: boolean;
    hoverable?: boolean;
    setShowAllTags?: React.Dispatch<React.SetStateAction<boolean>>;
    streetcode?: Streetcode;
}

const RelatedFigureItem = ({
    relatedFigure, setActiveTagId, setShowAllTags, streetcode, filterTags = true, hoverable = false,
}: Props) => {
    const {
        id, imageId, title, tags, alias, url, image,
    } = relatedFigure;
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { tagsList } } = modalStore;
    const windowsize = useWindowSize();

    const handleClick = () => {
        if (windowsize.width <= 1024) {
            setModal('relatedFigureItem', id, true);
        }
    };

    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);

    const commonTags = tags.filter((tag) => streetcode?.tags.find((ti) => ti.id === tag.id));

    return (
        <>
            {windowsize.width > 1024 && (
                <Link
                    className={`relatedFigureSlide 
                    ${hoverable && commonTags.length > 1 ? 'hoverable' : undefined} 
                    ${hoverable && commonTags.length > 1 && totalLength < 27 ? 'single_row' : undefined}`}
                    style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
                    to={`/${url}`}
                    onClick={() => {
                        if (!tagsList) {
                            relatedFiguresLeaveEvent();
                            setModal('tagsList');
                            if (setShowAllTags) {
                                setShowAllTags(true);
                            }
                        }
                    }}
                >
                    <div className="figureSlideText">
                        <div className="heading">
                            <p>{title}</p>
                            {
                                alias !== null ? (
                                    <p className="aliasText">
                                        (
                                        {alias}
                                        )
                                    </p>
                                ) : undefined
                            }
                        </div>
                        <div className={`relatedTagList ${commonTags.length > 1 ? undefined : 'noneTags'}`}>
                            {commonTags.map((tag) => (
                                <button
                                    type="button"
                                    key={tag.id}
                                    className="tag"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        relatedFiguresTagsEvent(tag.title);
                                        setModal('tagsList');
                                        setActiveTagId(tag.id);
                                        if (setShowAllTags) {
                                            setShowAllTags(true);
                                        }
                                    }}
                                >
                                    <p>{tag.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </Link>
            )}
            {windowsize.width <= 1024 && (
                <>
                    <div
                        className="relatedFigureSlide"
                        style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})`, backgroundSize: 'cover' }}
                        onClick={handleClick}
                    />
                    <div className="figureSlideText mobile">
                        <div className="heading">
                            <p>{title}</p>
                            {
                                alias !== null ? (
                                    <p className="aliasText">
                                        (
                                        {alias}
                                        )
                                    </p>
                                ) : undefined
                            }
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default RelatedFigureItem;

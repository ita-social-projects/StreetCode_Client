/* eslint-disable complexity */
import './RelatedFigureItem.styles.scss';

import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx, { useModalContext } from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { relatedFiguresLeaveEvent, relatedFiguresTagsEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    relatedFigure: RelatedFigure;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>;
    filterTags?: boolean;
    hoverable?: boolean;
}

const RelatedFigureItem = ({ relatedFigure, setActiveTagId, filterTags = true, hoverable = false }: Props) => {
    const {
        id, imageId, title, tags, alias, url, image,
    } = relatedFigure;
    const { tagsStore: { getTagArray } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { tagsList } } = modalStore;
    const windowsize = useWindowSize();

    const handleClick = () => {
        if (windowsize.width <= 1024) {
            setModal('relatedFigureItem', id, true);
        }
    };

    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);
    return (
        <>
            {windowsize.width > 1024 && (
                <a
                    className={`relatedFigureSlide 
                    ${hoverable && tags.length > 1 ? 'hoverable' : undefined} 
                    ${hoverable && tags.length > 1 && totalLength < 27 ? 'single_row' : undefined}`}

                    style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
                    href={`/${url}`}
                    onClick={() => {
                        window.scrollTo(0, 0);
                        if (!tagsList) {
                            relatedFiguresLeaveEvent();
                            setModal('tagsList');
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
                        {tags.filter((tag) => getTagArray.find((ti) => ti.id === tag.id || !filterTags))
                            .map((tag) => (
                                <button
                                    type="button"
                                    key={tag.id}
                                    className="tag"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        relatedFiguresTagsEvent(tag.title);
                                        setModal('tagsList');
                                        setActiveTagId(tag.id);
                                    }}
                                >
                                    <p>{tag.title}</p>
                                </button>
                            ))}
                        <div className={`relatedTagList ${tags.length > 1 ? undefined : 'noneTags'}`}>
                            {tags
                                .map((tag) => (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        className="tag"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            relatedFiguresTagsEvent(tag.title);
                                            setModal('tagsList');
                                            setActiveTagId(tag.id);
                                        }}
                                    >
                                        <p>{tag.title}</p>
                                    </button>
                                ))}
                        </div>
                    </div>
                </a>
            )}
            {windowsize.width <= 1024 && (
                <>
                    <div
                        className="relatedFigureSlide"
                        style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
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

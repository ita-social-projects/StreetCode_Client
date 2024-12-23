/* eslint-disable complexity */
import './RelatedFigureItem.styles.scss';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx, { useModalContext } from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { relatedFiguresTagsEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    relatedFigure: RelatedFigure;
    hoverable?: boolean;
}

const RelatedFigureItem = ({ relatedFigure, hoverable = false }: Props) => {
    const {
        id, title, tags, alias, url, image,
    } = relatedFigure;
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { tagsList } } = modalStore;
    const { relatedFiguresStore } = useMobx();
    const setActiveTagId = relatedFiguresStore.getSetActiveTagIdFn();
    const setShowAllTags = relatedFiguresStore.getSetShowAllTagsFn();
    const windowsize = useWindowSize();
    const totalLength: number = tags.reduce((acc, str) => acc + str.title.length, 0);
    const commonTags = relatedFiguresStore.getCommonTags(id);
    const [isPositionFixed, setIsPositionFixed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const tagListRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [activeCard, setActiveCard] = useState<number | null>(null);

    useEffect(() => () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const handleMouseEnter = (cardId: number, e: React.MouseEvent<HTMLAnchorElement>) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setActiveCard(cardId);
        setIsPositionFixed(false);
        timerRef.current = setTimeout(() => {
            setIsPositionFixed(true);
        }, 2000);
    };

    const handleMouseMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (isPositionFixed) return;
        const target = e.currentTarget as HTMLElement;
        const tagListHeight = tagListRef.current?.offsetHeight || 0;
        target.style.setProperty('--cursor-x', `${e.clientX - 50}px`);
        target.style.setProperty('--cursor-y', `${e.clientY - tagListHeight - 10}px`);
    };

    const handleTagListClick = (tagId: number, tagTitle: string, event: React.MouseEvent) => {
        event.preventDefault();
        relatedFiguresTagsEvent(tagTitle);
        setModal('tagsList');
        setActiveTagId(tagId);
        setShowAllTags(true);
    };

    const handleRelatedFigureClick = () => {
        if (windowsize.width <= 1024) {
            setModal('relatedFigureItem', id, true);
        }
    };

    return (
        <>
            {windowsize.width > 1024 && (
                <Link
                    className={`relatedFigureSlide 
                    ${hoverable && commonTags.length >= 1 ? 'hoverable' : undefined} 
                    ${hoverable && commonTags.length >= 1 && totalLength < 27 ? 'single_row' : undefined}`}
                    style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
                    to={`/${url}`}
                    onMouseEnter={(e) => handleMouseEnter(id, e)}
                    onMouseMove={handleMouseMove}
                >
                    <div className="figureSlideText">
                        <div className="heading">
                            <p>{title}</p>
                            {alias && <p className="aliasText">{alias}</p>}
                        </div>
                        {/* eslint-disable-next-line max-len */}
                        <div ref={tagListRef} className={`relatedTagList ${commonTags.length >= 1 ? undefined : 'noneTags'}`}>
                            {commonTags.map((tag) => (
                                <button
                                    type="button"
                                    key={tag.id}
                                    className="tag"
                                    onClick={(e) => handleTagListClick(tag.id, tag.title, e)}
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
                        style={{
                            backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})`,
                            backgroundSize: 'cover',
                        }}
                        onClick={handleRelatedFigureClick}
                    />
                    <div className="figureSlideText mobile">
                        <div className="heading">
                            <p>{title}</p>
                            {alias && <p className="aliasText">{alias}</p>}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default RelatedFigureItem;

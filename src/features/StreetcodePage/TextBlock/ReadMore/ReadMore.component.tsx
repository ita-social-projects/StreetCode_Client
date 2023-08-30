/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import { useEffect, useRef, useState } from 'react';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';

interface Props {
  text: string;
  maxLines?: number;
}

const ReadMore = ({ text, maxLines = 25 }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [showButtons, setShowButtons] = useState(true);
    const readMoreRef = useRef<HTMLSpanElement | null>(null);
    const textContainerRef = useRef<HTMLDivElement | null>(null);
    const firstRender = useRef(true);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const textContainerStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: expanded ? 'unset' : maxLines,
        overflow: 'hidden',
    };
    function decodeHtmlEntities(html: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
    useEffect(() => {
        const container = textContainerRef.current;
        const displayedText = container?.textContent || '';
        const cleanedText = decodeHtmlEntities(text).replace(/<[^>]+>/g, ''); // Видаляє всі HTML-теги
        if (displayedText.length < cleanedText.length) {
            setShowButtons(false);
        } else {
            setShowButtons(true);
        }
    }, [text]);

    useEffect(() => {
        if (!expanded && readMoreRef.current && !firstRender.current) {
            const screenHeight = window.innerHeight;

            const rect = readMoreRef.current.getBoundingClientRect();
            const elementTop = rect.top;

            const scrollPosition = window.scrollY + elementTop - screenHeight;

            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
        if (firstRender.current) {
            firstRender.current = false;
        }
    }, [expanded]);

    return (
        <>
            <div className="text">
                <div
                    className="textMain"
                    style={textContainerStyle}
                    ref={textContainerRef}
                >
                    <SearchTerms mainText={text} />
                </div>
                {showButtons && (
                    <div className="readMoreContainer">
                        <span
                            className="readMore"
                            onClick={toggleExpanded}
                            ref={readMoreRef}
                        >
                            {!expanded ? 'Трохи ще' : 'Дещо менше'}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default ReadMore;

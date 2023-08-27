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
    const readMoreRef = useRef<HTMLSpanElement | null>(null);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const textContainerStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: expanded ? 'unset' : maxLines,
        overflow: 'hidden',
    };

    useEffect(() => {
        if (!expanded && readMoreRef.current) {
            const screenHeight = window.innerHeight;

            const rect = readMoreRef.current.getBoundingClientRect();
            const elementTop = rect.top;

            const scrollPosition = window.scrollY + elementTop - screenHeight;

            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    }, [expanded]);

    return (
        <>
            <div className="text">
                <div
                    className={!expanded ? 'textShort' : undefined}
                    style={textContainerStyle}
                >
                    <SearchTerms mainText={text} />
                </div>
                <div className="readMoreContainer">
                    <span
                        className="readMore"
                        onClick={toggleExpanded}
                        ref={readMoreRef}
                    >
                        {!expanded ? 'Трохи ще' : 'Дещо менше'}
                    </span>
                </div>
            </div>
        </>
    );
};

export default ReadMore;

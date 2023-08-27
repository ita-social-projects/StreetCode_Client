/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import { useRef, useState } from 'react';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';

interface Props {
  text: string;
  maxLines?: number;
}

const ReadMore = ({ text, maxLines = 25 }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const textRef = useRef<HTMLDivElement | null>(null);

    const toggleExpanded = () => {
        if (textRef.current && expanded) {
            textRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setExpanded(!expanded);
    };

    const textContainerStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: expanded ? 'unset' : maxLines,
        overflow: 'hidden',
    };

    return (
        <>
            <div className="text">
                <div
                    className={!expanded ? 'textShort' : undefined}
                    style={textContainerStyle}
                    ref={textRef}
                >
                    <SearchTerms mainText={text} />
                </div>
                <div className="readMoreContainer">
                    <span
                        className="readMore"
                        onClick={toggleExpanded}
                    >
                        {!expanded ? 'Трохи ще' : 'Дещо менше'}
                    </span>
                </div>
            </div>
        </>
    );
};

export default ReadMore;

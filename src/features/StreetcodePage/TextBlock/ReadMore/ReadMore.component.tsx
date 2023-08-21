/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import { useEffect, useRef, useState } from 'react';
import useToggle from '@hooks/stateful/useToggle.hook';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';
import lineHeight from 'line-height';

import { moreTextEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    text: string;
}

const ReadMore = ({ text }: Props) => {
    const {
        toggleState: isReadMore,
        handlers: { toggle },
    } = useToggle(true);

    const [isOverflowed, setIsOverflowed] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const VISIBLE_LINES = 25;

    useEffect(() => {
        const handleResize = () => {
            if (textRef.current) {
                const container = textRef.current;
                const containerHeight = container.clientHeight;
                const foundLineHeight = lineHeight(container);
                const lines = Math.ceil(containerHeight / foundLineHeight);
                setIsOverflowed(lines > VISIBLE_LINES);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {isOverflowed ? (
                <div className="text">
                    <div
                        className={isReadMore ? 'textShort' : undefined}
                        style={{ whiteSpace: 'pre-line' }}
                        ref={textRef}
                    >
                        <SearchTerms mainText={text} />
                    </div>
                    <div className="readMoreContainer">
                        <span
                            className="readMore"
                            onClick={() => {
                                toggle();
                                moreTextEvent();
                            }}
                        >
                            {isReadMore ? 'Трохи ще' : 'Дещо менше'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mainTextContent" ref={textRef}>
                    <SearchTerms mainText={text} />
                </div>
            )}
        </>
    );
};

export default ReadMore;

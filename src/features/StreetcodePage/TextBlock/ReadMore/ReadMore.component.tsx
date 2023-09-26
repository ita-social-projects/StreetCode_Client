/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';
import classnames from 'classnames';
import * as lodash from 'lodash';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

interface Props {
  text: string;
  maxLines?: number;
}

const ReadMore = ({ text, maxLines = 25 }: Props) => {
    const [clamped, setClamped] = useState(true);
    const [showButtons, setShowButtons] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const readMoreRef = useRef<HTMLSpanElement | null>(null);
    const firstRender = useRef(true);
    const windowSize = useWindowSize();
    
    const handleClick = () => setClamped(!clamped);

    useEffect(() => {
        const hasClamping = (el: HTMLDivElement) => {
            const { clientHeight, scrollHeight } = el;
            return clientHeight !== scrollHeight;
        };

        const checkButtonAvailability = () => {
            if (containerRef.current) {
                const hadClampClass = containerRef.current.classList.contains('clamp');
                if (!hadClampClass) containerRef.current.classList.add('clamp');
                setShowButtons(hasClamping(containerRef.current));
                if (!hadClampClass) containerRef.current.classList.remove('clamp');
            }
        };

        const debouncedCheck = lodash.debounce(checkButtonAvailability, 50);

        checkButtonAvailability();
        window.addEventListener('resize', debouncedCheck);

        return () => {
            window.removeEventListener('resize', debouncedCheck);
        };
    }, [containerRef]);

    const textContainerStyle: CSSProperties = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: maxLines,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        overflowWrap: 'normal',
    };

    useEffect(() => {
        if (clamped && readMoreRef.current && !firstRender.current) {
            const screenHeight = window.innerHeight;

            const rect = readMoreRef.current.getBoundingClientRect();
            const elementTop = rect.top;

            const scrollPosition = window.scrollY + elementTop - screenHeight;

            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
        if (firstRender.current) {
            firstRender.current = false;
        }
    }, [clamped]);
    const className = classnames('long-text', clamped && 'clamp');

    return (
        <>
            <div className="text">
                <div
                    ref={containerRef}
                    className={className}
                    style={className.includes('clamp') ? textContainerStyle : undefined}
                >
                    <SearchTerms mainText={text} />
                </div>
                {showButtons && windowSize.width > 480 && (
                    <div className="readMoreContainer">
                        <span
                            className="readMore"
                            onClick={handleClick}
                            ref={readMoreRef}
                        >
                            {clamped ? 'Трохи ще' : 'Дещо менше'}
                        </span>
                    </div>
                )}
                {showButtons && windowSize.width <= 480 && (
                    <div className="readMoreContainer">
                        {clamped ? <span
                            className="readMore"
                            onClick={handleClick}
                            ref={readMoreRef}
                        >
                            Трохи ще
                        </span> : 
                        <input type='button' className="readLess" onClick={handleClick} value={'Згорнути'}></input>
                        // <button className="readLess" onClick={handleClick}>
                        //     <p>Згорнути</p>
                        // </button>
                        }
                        
                    </div>
                )}
            </div>
        </>
    );
};

export default ReadMore;

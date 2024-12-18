/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';

interface Props {
  text: string;
}

const MAX_LENGTH_DESKTOP = 2000;
const MAX_LENGTH_TABLET = 1600;
const MAX_LENGTH_MOBILE = 900;

const ReadMore = ({ text }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const readMoreRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery({
        query: '(max-width: 480px)',
    });
    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });
    const isTablet = useMediaQuery({
        query: '(min-width: 481px) and (max-width: 1024px)',
    });

    const isTextLong = (isDesktop && text.length > MAX_LENGTH_DESKTOP)
                                || (isTablet && text.length > MAX_LENGTH_TABLET)
                                || (isMobile && text.length > MAX_LENGTH_MOBILE);

    useEffect(() => {
        if (!isExpanded && isClicked && isTextLong && readMoreRef.current) {
            const screenHeight = window.innerHeight;

            const rect = readMoreRef.current.getBoundingClientRect();
            const elementTop = rect.top;

            const scrollPosition = window.scrollY + elementTop - screenHeight;

            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    }, [isExpanded, isClicked]);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function getTrunculatedText(text: string) {
        let maxLength = text.length;

        if (isDesktop) {
            maxLength = MAX_LENGTH_DESKTOP;
        } else if (isTablet) {
            maxLength = MAX_LENGTH_TABLET;
        } else if (isMobile) {
            maxLength = MAX_LENGTH_MOBILE;
        }

        return `${text.substring(0, maxLength)}...`;
    }

    return (
        <div className='readMoreComponent'>
            <div className="text">
                <SearchTerms mainText={
                    isTextLong && !isExpanded
                        ? getTrunculatedText(text)
                        : text
                }
                />

                {isTextLong && (
                    <div
                        ref={readMoreRef}
                        className={`readMoreContainer ${isExpanded && 'readLessContainer'}`}
                    >
                        <span
                            className={`readMore ${isExpanded && 'readLess'}`}
                            onClick={() => {
                                setIsExpanded((prev) => !prev);
                                setIsClicked(true);
                            }}
                        >
                            {!isExpanded ? 'Трохи ще' : isMobile ? 'Згорнути текст' : 'Дещо менше'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadMore;

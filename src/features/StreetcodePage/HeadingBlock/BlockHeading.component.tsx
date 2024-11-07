import './BlockHeading.styles.scss';

import Rhombus from '@images/utils/rhombus.svg';
import RhombusMobile from '@images/utils/rhombus_mobile.svg';

import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

interface Props {
    headingText: string;
}

const BlockHeading = ({ headingText }: Props) => {
    const elementRef = useRef<HTMLHeadingElement | null>(null);

    const isMobile = useMediaQuery({
        query: '(max-width: 1024px)',
    });

    useEffect(
        () => {
            const element = elementRef.current;
            if (element) {
                setTimeout(() => {
                    while (element.offsetHeight > 80 && isMobile) {
                        const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
                        element.style.fontSize = `${fontSize - 2}px`;
                    }
                }, 1000);
            }
        },
        [],
    );

    return (
        <div className="blockHeadingWrapper">
            <div className="blockHeadingContainer">
                <div className="rhombus">
                    {!isMobile
                        && <Rhombus />}
                    {isMobile && <RhombusMobile />}
                </div>
                <div className="blockHeadingTextContainer">
                    <h1
                        ref={elementRef}
                        className="blockHeadingText"
                    >
                        {headingText}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default BlockHeading;

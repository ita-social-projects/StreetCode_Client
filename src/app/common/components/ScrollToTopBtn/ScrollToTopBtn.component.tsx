import './ScrollToTopBtn.styles.scss';

import { CSSProperties, useEffect, useState } from 'react';
import ScrollBtn from '@assets/images/utils/ScrollToTopBtn.svg';
import useEventListener from '@hooks/external/useEventListener.hook';

interface Props {
    scrollDelay?: number;
    visibleAfterPx?: number;
    btnStyle?: CSSProperties;
}

const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const ScrollToTopBtn = ({ scrollDelay = 300, visibleAfterPx = 1400, btnStyle }: Props) => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEventListener(
        'scroll',
        () => {
            setShowTopBtn(window.scrollY > visibleAfterPx);
        },
    );
    return (
        <>
            {showTopBtn && (
                <div
                    className="scrollToTopBtnContainer"
                    onClick={() => setTimeout(goToTop, scrollDelay)}
                >
                    <ScrollBtn style={btnStyle} />
                </div>
            )}
        </>
    );
};

export default ScrollToTopBtn;

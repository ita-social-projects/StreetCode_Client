import './ScrollToTopBtn.styles.scss';

import { CSSProperties, useEffect, useState } from 'react';
import ScrollBtn from '@assets/images/utils/ScrollToTopBtn.svg';

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

const ScrollToTopBtn = ({ scrollDelay = 300, visibleAfterPx = 800, btnStyle }: Props) => {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShowTopBtn(window.scrollY > visibleAfterPx);
        };
        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, [visibleAfterPx]);

    return (
        <div className="scrollToTopBtnContainer">
            {showTopBtn && (
                <ScrollBtn
                    style={btnStyle}
                    className="scrollToTopBt"
                    onClick={() => setTimeout(goToTop, scrollDelay)}
                />
            )}
        </div>
    );
};

export default ScrollToTopBtn;

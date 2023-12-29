import { useEffect } from 'react';
import { NavigationType, useLocation, useNavigationType } from 'react-router-dom';

const useScrollToTop = () => {
    const pathname = useLocation();

    const navType = useNavigationType();

    const isPop = navType === NavigationType.Pop;

    const scrollToTop = () => window.scrollTo(0, 0);

    useEffect(() => {
        scrollToTop();
    }, [pathname, isPop]);

    useEffect(() => {
        window.addEventListener('beforeunload', scrollToTop);
        return () => {
            window.removeEventListener('beforeunload', scrollToTop);
        };
    }, []);
};

export default useScrollToTop;

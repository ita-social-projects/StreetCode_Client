import { RefObject, useEffect, useRef, useState } from 'react';

const useOnScreen = (ref: RefObject<HTMLElement>, classSelector: string) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        const options = {
            root: document.querySelector(classSelector),
            rootMargin: '0px',
            threshold: 1.0,
        };
        observerRef.current = new IntersectionObserver(([entry]) => {
            setIsOnScreen(entry.intersectionRatio >= 0.5);
        }, options);
    }, []);

    useEffect(() => {
        observerRef.current?.observe(ref.current as Element);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [ref]);

    return isOnScreen;
};

export default useOnScreen;

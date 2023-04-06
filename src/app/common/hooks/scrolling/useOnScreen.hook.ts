import { RefObject, useEffect, useRef, useState } from 'react';

const useOnScreen = (ref: RefObject<HTMLElement>) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting));
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

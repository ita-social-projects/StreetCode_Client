import { useEffect, useState } from 'react';

const useScrollDirection = (minDelta = 10) => {
    const [scrollDirection, setScrollDirection] = useState<string | undefined>();

    useEffect(() => {
        let latestScrollPosition = window.scrollY;

        const updateScrollDirection = () => {
            const curScrollPosition = window.scrollY;
            const direction = curScrollPosition > latestScrollPosition ? 'down' : 'up';

            if (direction !== scrollDirection
                && (curScrollPosition - latestScrollPosition > minDelta
                    || curScrollPosition - latestScrollPosition < -minDelta)) {
                setScrollDirection(direction);
            }
            latestScrollPosition = (curScrollPosition > 0) ? curScrollPosition : 0;
        };

        window.addEventListener('scroll', updateScrollDirection);

        return () => {
            window.removeEventListener('scroll', updateScrollDirection);
        };
    }, [scrollDirection, minDelta]);

    return scrollDirection;
};

export default useScrollDirection;

import { useEffect, useRef } from 'react';

const useRenderCount = () => {
    const isMounted = useRef(true);
    const renderCount = useRef(1);

    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            renderCount.current += 1;
        }
    }, []);

    return renderCount.current;
};

export default useRenderCount;

import { useEffect, useRef } from 'react';

const useEventListener = (
eventType: string,
cb: Function,
                          element: Element | typeof window = window,
) => {
    const cbRef = useRef(cb);

    useEffect(() => {
        cbRef.current = cb;
    }, [cb]);

    useEffect(() => {
        const handler = (ev: Event) => cbRef.current(ev);
        element.addEventListener(eventType, handler);

        return () => element.removeEventListener(eventType, handler);
    }, [element, eventType]);
};

export default useEventListener;

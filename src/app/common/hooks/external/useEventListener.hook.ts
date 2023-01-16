import { useEffect, useRef } from 'react';

type BindingElement = Element | typeof window;
type EventType = keyof ElementEventMap | keyof WindowEventMap;

const useEventListener = (
    eventType: EventType,
    cb: (event: Event) => void,
    element: BindingElement = window,
) => {
    const cbRef = useRef(cb);

    useEffect(() => {
        cbRef.current = cb;
    }, [cb]);

    useEffect(() => {
        const handler = (e: Event) => cbRef.current(e);
        element.addEventListener(eventType, handler);

        return () => element.removeEventListener(eventType, handler);
    }, [element, eventType]);
};

export default useEventListener;

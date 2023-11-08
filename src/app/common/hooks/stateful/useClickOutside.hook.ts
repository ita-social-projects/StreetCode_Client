import { RefObject, useEffect } from 'react';

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref1: RefObject<T>,
    ref2: RefObject<T>,
    handler: () => void,
) => {
    useEffect(() => {
        const listener = (event: Event) => {
            const nodeTarget = event.target as Node;
            if ((ref1.current && !ref1.current.contains(nodeTarget) && !ref2.current) 
                || ((ref1.current && !ref1.current.contains(nodeTarget)) && (ref2.current && !ref2.current.contains(nodeTarget)))
            ) {
                handler();
            }
            else{
                return;
            }
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref1, ref2, handler]);
}

export default useOnClickOutside;

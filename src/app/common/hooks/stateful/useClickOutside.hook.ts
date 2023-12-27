import { RefObject, useEffect } from 'react';

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    refArray: RefObject<T>[],
    handler: () => void,
) => {
    useEffect(() => {
        const listener = (event: Event) => {
            const nodeTarget = event.target as Node;
            if (refArray.length === 1) {
                if ((refArray[0].current && !refArray[0].current.contains(nodeTarget))) {
                    handler();
                } else {

                }
            } else if (refArray.length === 2) {
                if ((refArray[0].current && !refArray[0].current.contains(nodeTarget) && !refArray[1].current)
                        || ((refArray[0].current && !refArray[0].current.contains(nodeTarget)) && (refArray[1].current && !refArray[1].current.contains(nodeTarget)))
                ) {
                    handler();
                } else {

                }
            } else {

            }
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [refArray, handler]);
};

export default useOnClickOutside;

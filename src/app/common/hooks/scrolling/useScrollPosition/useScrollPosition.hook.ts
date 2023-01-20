import { DependencyList, useEffect, useLayoutEffect, useRef } from 'react';

import { ElementRefOrDefault, ScrollProps } from './useScrollPosition';
import getScrollPosition, { isBrowser } from './useScrollPosition.utils';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const useScrollPosition = (
    effect: (props: ScrollProps) => void,
    wait?: number,
    deps?: DependencyList,
    element?: ElementRefOrDefault,
    useWindow?: boolean,
    boundingElement?: ElementRefOrDefault,
) => {
    const position = useRef(getScrollPosition(
        {
            useWindow,
            boundingElement,
        },
    ));

    let throttleTimeout: NodeJS.Timeout | null = null;

    const callBack = () => {
        const currentPos = getScrollPosition({
            element,
            useWindow,
            boundingElement,
        });

        effect({ previousPos: position.current, currentPos });

        position.current = currentPos;
        throttleTimeout = null;
    };

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) {
            return;
        }

        const handleScroll = () => {
            if (wait) {
                if (throttleTimeout === null) {
                    throttleTimeout = setTimeout(callBack, wait);
                }
            } else {
                callBack();
            }
        };

        if (boundingElement) {
            boundingElement.current?.addEventListener('scroll', handleScroll, { passive: true });
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (boundingElement) {
                boundingElement.current?.removeEventListener('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll);
            }

            if (throttleTimeout) {
                clearTimeout(throttleTimeout);
            }
        };
    }, deps);
};

useScrollPosition.defaultProps = {
    deps: [],
    element: false,
    useWindow: false,
    wait: null,
    boundingElement: false,
};

export default useScrollPosition;

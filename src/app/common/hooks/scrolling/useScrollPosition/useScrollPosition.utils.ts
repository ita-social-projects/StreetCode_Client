import { ScrollOptions } from './useScrollPosition';

const zeroPosition = { x: 0, y: 0 };
export const isBrowser = typeof window !== 'undefined';

export const getClientRect = (element?: HTMLElement) => element?.getBoundingClientRect();

const getScrollPosition = ({ element, useWindow, boundingElement }: ScrollOptions) => {
    if (!isBrowser) {
        return zeroPosition;
    }

    if (useWindow) {
        return { x: window.scrollX, y: window.scrollY };
    }

    const targetPosition = getClientRect(element?.current || document.body);
    const containerPosition = getClientRect(boundingElement?.current);

    if (!targetPosition) {
        return zeroPosition;
    }

    return containerPosition
        ? {
            x: (containerPosition.x || 0) - (targetPosition.x || 0),
            y: (containerPosition.y || 0) - (targetPosition.y || 0),
        }
        : { x: targetPosition.left, y: targetPosition.top };
};

export default getScrollPosition;

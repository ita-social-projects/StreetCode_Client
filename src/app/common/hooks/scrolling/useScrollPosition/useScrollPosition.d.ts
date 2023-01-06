import { MutableRefObject } from 'react';

export interface PagePosition {
    x: number;
    y: number;
}

export interface ScrollProps {
    previousPos: PagePosition;
    currentPos: PagePosition;
}

export interface ScrollOptions {
    element?: ElementRefOrDefault;
    boundingElement?: ElementRefOrDefault;
    useWindow?: boolean;
}

export type ElementRefOrDefault = MutableRefObject<HTMLElement | undefined>;

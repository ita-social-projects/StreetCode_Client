declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
declare module '*.css';
declare module '*.jpeg';
declare module 'line-height' {
    function lineHeight(container: HTMLElement): number;
    export default lineHeight;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.woff';
declare module '*.woff2';
declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
declare module '*.css';
declare module '*.jpeg';
declare module '*.webp' {
    const value: any;
    export = value;
}

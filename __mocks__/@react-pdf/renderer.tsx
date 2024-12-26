export const Font = {
    register: jest.fn(),
};

export const Document = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Page = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const View = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Text = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
export const Image = ({ source }: { source: string }) => <img src={source} alt="mocked image"/>;
export const StyleSheet = {
    create: (styles: Record<string, any>) => styles,
};
export const Svg = ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>;
export const Rect = (props: any) => <rect {...props} />;
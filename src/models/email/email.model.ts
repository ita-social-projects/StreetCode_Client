export default interface Email {
    from?: string;
    source: string;
    content: string;
    token: string | null | undefined;
}

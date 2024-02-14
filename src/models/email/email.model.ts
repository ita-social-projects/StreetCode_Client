export default interface Email {
    from?: string;
    content: string;
    token: string | null | undefined;
}

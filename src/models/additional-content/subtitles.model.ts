export default interface Subtitle {
    id: number;
    subtitleText: string;
    streetcodeId: number;
}

export interface SubtitleCreate {
    subtitleText: string;
}

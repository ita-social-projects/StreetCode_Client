export default interface StreetcodeFilterRequestDTO {
    searchQuery: string,
}

export interface StreetcodeFilterResultDTO {
    streetcodeId: number,
    streetcodeTransliterationUrl: string,
    streetcodeIndex: number,
    blockName: string,
    content: string,
    sourceName: string
}

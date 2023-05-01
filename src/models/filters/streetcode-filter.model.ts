export default interface StreetcodeFilterRequestDTO {
    searchQuery: string,
}

export interface StreetcodeFilterResultDTO {
    streetcodeId: number,
    streetcodeUrl: string,
    content: string,
    subEntityId?: number,
    sourceName: string
}

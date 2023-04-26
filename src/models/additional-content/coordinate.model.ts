export default interface StreetcodeCoordinate extends Coordinate {
    streetcodeId: number;
}

export interface ToponymCoordinate extends Coordinate {
    toponymId: number;
}

export interface Coordinate {
    id: number;
    latitude: number;
    longtitude: number;
}

export interface Coordinate {
    id: number;
    latitude: number;
    longtitude: number;
}

export interface StreetcodeCoordinate extends Coordinate {
    streetcodeId: number;
    coordinate?: Coordinate | undefined;
}

export interface ToponymCoordinate extends Coordinate {
    toponymId: number;
    coordinate?: Coordinate | undefined;
}
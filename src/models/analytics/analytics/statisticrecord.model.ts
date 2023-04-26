import StreetcodeCoordinate from '@models/additional-content/coordinate.model';

export default interface StatisticRecord {
    id: number,
    streetcodeCoordinate: StreetcodeCoordinate,
    coordinateId: number,
    qrId: number,
    title: string,
    count: number,
    address: string,
}

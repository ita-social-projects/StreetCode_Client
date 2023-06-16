import StreetcodeCoordinate from '@models/additional-content/coordinate.model';
import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

export default interface StatisticRecord {
    id: number,
    streetcodeCoordinate: StreetcodeCoordinate,
    qrId: number,
    count: number,
    address: string,
}

export interface StatisticRecordUpdate extends StatisticRecord, IModelState, IPersisted {
    streetcodeId?: number,
}

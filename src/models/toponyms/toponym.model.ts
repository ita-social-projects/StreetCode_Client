import { ToponymCoordinate } from "@models/additional-content/coordinate.model";
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Toponym {
    id: number;
    oblast: string;
    adminRegionOld?: string | undefined;
    adminRegionNew?: string | undefined;
    gromada?: string | undefined;
    community?: string | undefined;
    streetName?: string | undefined;
    streetType?: string | undefined;
    coordinate: ToponymCoordinate;
    streetcodes: Streetcode[];
}

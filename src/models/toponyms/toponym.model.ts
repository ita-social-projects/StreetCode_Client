// import { ToponymCoordinate } from "@models/additional-content/coordinates.model";
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Toponym {
    id: number;
    title: string;
    description?: string | undefined;
    // coordinates: ToponymCoordinate[];
    streetcodes: Streetcode[];
}

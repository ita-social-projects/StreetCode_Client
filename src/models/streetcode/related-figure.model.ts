import Streetcode from "./streetcode-types.model";

export default interface RelatedFigure {
    observer: Streetcode;
    observerId: number;
    target: Streetcode;
    targetId: number;
}
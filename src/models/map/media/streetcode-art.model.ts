import Streetcode from "../streetcode/streetcode-types.model";
import Art from "./art.model";

export default interface StreetcodeArt {
    index: number;
    streetcodeId: number;
    streetcode: Streetcode;
    artId: number;
    art: Art;
}
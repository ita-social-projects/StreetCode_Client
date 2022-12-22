import Image from "models/media/image.model";
import Toponym from "models/toponyms/toponym.model";
import Streetcode from "models/streetcode/streetcode-types.model";

export default interface Map {
    image: Image;
    toponyms: Toponym[];
    streetcodes: Streetcode[];
}
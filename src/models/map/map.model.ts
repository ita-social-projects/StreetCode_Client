import Image from '@models/media/image.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import Toponym from '@models/toponyms/toponym.model';

export default interface Map {
    image: Image;
    toponyms: Toponym[];
    streetcodes: Streetcode[];
}

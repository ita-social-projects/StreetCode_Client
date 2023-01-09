import Url from "./url.model";
import Streetcode from "@models/streetcode/streetcode-types.model";

export enum SubtitleStatus {
    Editor = 'Editor',
    Illustrator = 'Illustrator',
}

export default interface Subtitle {
    id: number;
    status: SubtitleStatus;
    firstName: string;
    lastName: string;
    description?: string | undefined;
    url: Url;
    streetcode: Streetcode;
}
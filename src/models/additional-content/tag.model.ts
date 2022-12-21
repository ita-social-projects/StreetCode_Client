import Streetcode from "models/streetcode/streetcode-types.model";

export default interface Tag {
    id: number;
    title: string;
    streetcodes: Streetcode[];
}
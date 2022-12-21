import Url from "models/additional-content/url.model";
import Streetcode from "models/streetcode/streetcode-types.model";
import { Fact } from "models/streetcode/text-contents.model";
import { SourceLinkCategory } from "models/sources/source-links.model";

export default interface Image {
    id: number;
    alt?: string | undefined;
    url: Url;
    streetcodes: Streetcode[];
    facts: Fact[];
    sourceLinkCategories: SourceLinkCategory[];
}
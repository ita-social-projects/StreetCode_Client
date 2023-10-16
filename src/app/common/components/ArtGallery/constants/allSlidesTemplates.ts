import { ArtSlideTemplateEnum } from '@models/enums/art-slide-template';
import { ModelState } from '@models/enums/model-state';
import { StreetcodeArtSlideAdmin } from '@models/media/streetcode-art-slide.model';

// eslint-disable-next-line max-len
const TEMPLATE_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAUcAAADoCAYAAAB8dCbkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMPSURBVHhe7cixDcAwAMOw/P90mr36wBTARed1AfjJCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADDzv0A9XdA8gKGinIAAAAASUVORK5CYII=';

const ALL_SLIDES_TEMPLATES: StreetcodeArtSlideAdmin[] = [
    {
        index: 1,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToFour,
        streetcodeArts: [
            {
                index: 1,
                art: {
                    id: 0,
                    imageId: 0,
                    image: {
                        id: 0,
                        base64: TEMPLATE_IMAGE_BASE64,
                        blobName: 'name',
                        mimeType: 'image/svg',
                    },
                },
            },
        ],
        modelState: ModelState.Created,
        isPersisted: false,
    },
    {
        index: 2,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToFourAndFiveToSix,
        streetcodeArts: [
            {
                index: 1,
                art: {
                    id: -1,
                    imageId: -1,
                    image: {
                        id: -1,
                        base64: TEMPLATE_IMAGE_BASE64,
                        blobName: 'name',
                        mimeType: 'image/svg',
                    },
                },
            },
            {
                index: 2,
                art: {
                    id: -1,
                    imageId: -1,
                    image: {
                        id: -1,
                        base64: TEMPLATE_IMAGE_BASE64,
                        blobName: 'name',
                        mimeType: 'image/svg',
                    },
                },
            },
        ],
        modelState: ModelState.Created,
        isPersisted: false,
    },
];

export default ALL_SLIDES_TEMPLATES;
export { TEMPLATE_IMAGE_BASE64 };

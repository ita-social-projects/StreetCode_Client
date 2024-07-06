/* eslint-disable import/extensions */
import { ModelState } from '@models/enums/model-state';

import { ArtSlideTemplateEnum } from '@/models/enums/art-slide-template';
import { StreetcodeArtSlideAdmin } from '@/models/media/streetcode-art-slide.model';

// eslint-disable-next-line max-len
const TEMPLATE_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAUcAAADoCAYAAAB8dCbkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMPSURBVHhe7cixDcAwAMOw/P90mr36wBTARed1AfjJCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADrcgKsywmwLifAupwA63ICrMsJsC4nwLqcAOtyAqzLCbAuJ8C6nADDzv0A9XdA8gKGinIAAAAASUVORK5CYII=';
const TEMPLATE_WHITE_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAUcAAADoCAYAAAB8dCbkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAL2SURBVHhe7dSxEYAwEMCwh/13JhQU4eIRpMYb+HpeA8DP/RWAjTkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4BgjgDBHAGCOQIEcwQI5ggQzBEgmCNAMEeAYI4AwRwBgjkCBHMECOYIEMwRIJgjQDBHgGCOAMEcAYI5AgRzBAjmCBDMESCYI0AwR4DDzAKUswXMuvXEwwAAAABJRU5ErkJggg==';

const SLIDE_TEMPLATE: StreetcodeArtSlideAdmin = {
    index: 1,
    template: ArtSlideTemplateEnum.OneToFour,
    streetcodeArts: [
        {
            index: 1,
            art: {
                id: 0,
                imageId: 0,
                image: {
                    id: 0,
                    base64: TEMPLATE_WHITE_IMAGE_BASE64,
                    blobName: 'name',
                    mimeType: 'image/svg',
                },
            },
        },
    ],
    modelState: ModelState.Created,
}

const bindStreetcodeIdToDefaultSlide = (streetcodeId: number) => {
    return {...SLIDE_TEMPLATE, streetcodeId: streetcodeId} as StreetcodeArtSlideAdmin;
}

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
    {
        index: 3,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToTwo,
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
        ],
        modelState: ModelState.Created,
        isPersisted: false,
    },
    {
        index: 4,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToTwoAndThreeToFour,
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
    {
        index: 5,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToFourAndFiveAndSix,
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
            {
                index: 3,
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
    {
        index: 6,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFiveToSix,
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
            {
                index: 3,
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
    {
        index: 7,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeToFour,
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
            {
                index: 3,
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
    {
        index: 8,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneToTwoAndThreeToFourAndFive,
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
            {
                index: 3,
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
    {
        index: 9,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeAndFour,
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
            {
                index: 3,
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
                index: 4,
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
    {
        index: 10,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFiveToSix,
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
            {
                index: 3,
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
                index: 4,
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
    {
        index: 11,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFive,
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
            {
                index: 3,
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
                index: 4,
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
    {
        index: 12,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeToFourAndFiveAndSix,
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
            {
                index: 3,
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
                index: 4,
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
                index: 5,
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
    {
        index: 13,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeAndFourAndFive,
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
            {
                index: 3,
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
                index: 4,
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
                index: 5,
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
    {
        index: 14,
        streetcodeId: -1,
        template: ArtSlideTemplateEnum.OneAndTwoAndThreeAndFourAndFiveAndSix,
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
            {
                index: 3,
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
                index: 4,
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
                index: 5,
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
                index: 6,
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

const EMPTY_ART_TEMPLATE = {
    id: -1,
    imageId: -1,
    image: {
        id: -1,
        base64: TEMPLATE_IMAGE_BASE64,
        blobName: 'name',
        mimeType: 'image/svg',
    },
}

export default ALL_SLIDES_TEMPLATES;
export { TEMPLATE_IMAGE_BASE64, EMPTY_ART_TEMPLATE, SLIDE_TEMPLATE, bindStreetcodeIdToDefaultSlide };

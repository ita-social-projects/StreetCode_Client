import { render, screen } from '@testing-library/react';

// eslint-disable-next-line import/extensions
import FromDateToString from '@/app/common/utils/FromDateToString';
import StreetcodeImage from '@/models/media/image.model';
import Streetcode, { Status, StreetcodeType } from '@/models/streetcode/streetcode-types.model';
import { Fact } from '@/models/streetcode/text-contents.model';
import TimelineItem from '@/models/timeline/chronology.model';

import '@testing-library/jest-dom';

import StreetcodeDocument from './StreetcodeDocument.component';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const timelineItemTestData: TimelineItem = {
    id: 0,
    date: new Date(1880, 0, 15).toDateString(),
    dateViewPattern: 0,
    title: 'Timeline item title',
    description: 'Timeline item description',
    historicalContexts: [],
};

const factTestData: Fact = {
    id: 0,
    factContent: 'Fact content',
    title: 'Fact title',
    image: {
        id: 0,
        blobName: 'test',
        mimeType: 'image/png',
        base64: 'factImageBase64',
    },
    imageId: 0,
    index: 0,
};

jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: () => ({
        factsStore: {
            getFactArray: [factTestData],
        },
        timelineItemStore: {
            getTimelineItemArray: [timelineItemTestData],
        },
        textVideoStore: {
            Text: {
                textContent: '<p>Text</p><strong>Bold text</strong>',
            },
        },
    }),
}));

describe('StreetcodeDocument', () => {
    it('should render document', async () => {
        const streetcode: Streetcode = {
            firstName: 'Name',
            lastName: 'Surname',
            title: 'Name Surname',
            dateString: '9 березня 1814 - 10 березня 1861',
            teaser: 'teaser',
            id: 0,
            index: 0,
            viewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            eventStartOrPersonBirthDate: new Date(),
            streetcodeType: StreetcodeType.Person,
            status: Status.Draft,
            text: '',
            transliterationUrl: '',
            toponyms: [],
            arts: [],
            images: [],
            tags: [],
            subtitles: [],
            facts: [],
            videos: [],
            sourceLinks: [],
            timelineItems: [],
            observers: [],
            targets: [],
            streetcodePartners: [],
            rank: '',
        };
        const image: StreetcodeImage = {
            id: 0,
            base64: 'base64string',
            blobName: 'filename',
            mimeType: 'image/png',
        };
        const { container } = render(<StreetcodeDocument streetcode={streetcode} image={image} />);

        screen.getByText(streetcode.title);
        screen.getByText(streetcode.dateString);
        screen.getByText(streetcode.teaser);

        screen.getByText('Text');
        screen.getByText('Bold text');

        const imageSource = `data:${image.mimeType};base64,${image.base64}`;
        await screen.findAllByRole('img', { name: /mocked image/i });
        const mainImage = container.querySelector(`[src="${imageSource}"]`);

        screen.debug();
        expect(mainImage).not.toBe(null);

        screen.getByText(timelineItemTestData.title);
        screen.getByText(timelineItemTestData.description!);
        const dateString = FromDateToString(new Date(timelineItemTestData.date), timelineItemTestData.dateViewPattern);
        screen.getAllByText(dateString);

        screen.getByText(factTestData.title);
        screen.getByText(factTestData.factContent);
        const factImageSource = `data:${factTestData.image!.mimeType};base64,${factTestData.image!.base64}`;
        const factImage = container.querySelector(`[src="${factImageSource}"]`);
        expect(factImage).not.toBe(null);
    });
});

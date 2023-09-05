import Image from "@/models/media/image.model";
import TeamMember, { Positions, TeamMemberLinkCreateUpdate } from "@/models/team/team.model";

const img: Image = {
    id: 1,
    base64: 'some string))',
    blobName: 'some name',
    mimeType: '.png',
}

const pos: Positions = {
    id: 1,
    position:'position',
}
const link: TeamMemberLinkCreateUpdate = {
    id: 1,
    targetUrl: 'some url',
    logoType: 1,
}

const listWithOneMember: TeamMember[] = [
    {
        id: 1,
        isMain: false,
        name: 'nosing1',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
];
const listWithThreeMember: TeamMember[] = [
    {
        id: 1,
        isMain: false,
        name: 'nothing1',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 2,
        isMain: false,
        name: 'nothing2',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 3,
        isMain: false,
        name: 'nothing3',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
];
const listWithFiveMember: TeamMember[] = [
    {
        id: 1,
        isMain: false,
        name: 'nothing1',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 2,
        isMain: false,
        name: 'nothing2',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 3,
        isMain: false,
        name: 'nothing3',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 4,
        isMain: false,
        name: 'nothing4',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
    {
        id: 5,
        isMain: false,
        name: 'nothing5',
        description: 'some description',
        imageId: 1,
        image: img,
        teamMemberLinks: [link,link,link],
        positions: [pos],
    },
];
export {listWithOneMember, listWithThreeMember, listWithFiveMember};
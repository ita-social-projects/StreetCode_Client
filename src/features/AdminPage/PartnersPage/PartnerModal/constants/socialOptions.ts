import { LogoType } from '@/models/team/team.model';

interface SocialItem {
    label: string
    value: string
    logo: LogoType
}

const SOCIAL_OPTIONS: SocialItem[] = [
    {
        value: 'x',
        label: 'X',
        logo: LogoType.x,
    },
    {
        value: 'instagram',
        label: 'Instagram',
        logo: LogoType.instagram,
    },
    {
        value: 'facebook',
        label: 'Facebook',
        logo: LogoType.facebook,
    },
    {
        value: 'youtube',
        label: 'Youtube',
        logo: LogoType.youtube,
    },
];

export default SOCIAL_OPTIONS;

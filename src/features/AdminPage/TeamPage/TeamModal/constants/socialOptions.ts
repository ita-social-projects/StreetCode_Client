/* eslint-disable import/extensions */

import SocialItem from '@/models/social-link/socialItem';
import { LogoType } from '@/models/team/team.model';

const SOCIAL_OPTIONS: SocialItem<LogoType>[] = [
    {
        value: 'x.com',
        label: 'X',
        logo: LogoType.x,
    },
    {
        value: 'instagram.com',
        label: 'Instagram',
        logo: LogoType.instagram,
    },
    {
        value: 'facebook.com',
        label: 'Facebook',
        logo: LogoType.facebook,
    },
    {
        value: 'youtube.com',
        label: 'Youtube',
        logo: LogoType.youtube,
    },
    {
        value: 'linkedin.com',
        label: 'LinkedIn',
        logo: LogoType.linkedin,
    },
    {
        value: 'tiktok.com',
        label: 'TikTok',
        logo: LogoType.tiktok,
    },
    {
        value: 'behance.net',
        label: 'Behance',
        logo: LogoType.behance,
    },
    {
        value: 'http',
        label: 'Ваш сайт',
        logo: LogoType.http,
    },
];

export default SOCIAL_OPTIONS;

/* eslint-disable import/extensions */

import { LogoType } from '@/models/partners/partners.model';
import SocialItem from '@/models/social-link/socialItem';

const SOCIAL_OPTIONS: SocialItem<LogoType>[] = [
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

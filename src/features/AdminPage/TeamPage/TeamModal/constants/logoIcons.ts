import { FunctionComponent, SVGAttributes } from 'react';
import behance from '@assets/images/partners/behance.svg';
import facebook from '@assets/images/partners/facebook.svg';
import http from '@assets/images/partners/http.svg';
import instagram from '@assets/images/partners/instagram.svg';
import linkedin from '@assets/images/partners/linkedin.svg';
import tiktok from '@assets/images/partners/tiktok.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';

import { LogoType } from '@/models/team/team.model';

interface LogoIcon {
    type: LogoType,
    icon: FunctionComponent<SVGAttributes<SVGElement>>
}
const LOGO_ICONS: LogoIcon[] = [
    {
        type: LogoType.instagram,
        icon: instagram,
    },
    {
        type: LogoType.facebook,
        icon: facebook,
    },
    {
        type: LogoType.youtube,
        icon: youtube,
    },
    {
        type: LogoType.linkedin,
        icon: linkedin,
    },
    {
        type: LogoType.behance,
        icon: behance,
    },
    {
        type: LogoType.tiktok,
        icon: tiktok,
    },
    {
        type: LogoType.x,
        icon: twitter,
    },
    {
        type: LogoType.http,
        icon: http,
    },
];
export default LOGO_ICONS;

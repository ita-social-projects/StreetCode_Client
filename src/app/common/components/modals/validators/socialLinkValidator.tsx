/* eslint-disable import/extensions */

import { MESSAGES } from '@/app/common/constants/messages/messages';
import { doesUrlContainSiteName, isInvalidUrl } from '@/app/common/utils/checkUrl';
import SocialItem from '@/models/social-link/socialItem';

export default function validateSocialLink<T>(
    link: string,
    socialOptions: SocialItem<T>[],
    logoTypes: string[],
    sourceLinks: { logoType: T }[],
    socialName: string,
): Promise<unknown> {
    if (!link || isInvalidUrl(link)) {
        return Promise.reject(new Error(
            MESSAGES.VALIDATION.INVALID_LINK,
        ));
    }

    const logotype = socialOptions.find((opt) => opt.value === socialName)?.logo;
    if (logotype === undefined // we need this explicit check because it can pass when logotype is 0
        || logotype === null
        || (!doesUrlContainSiteName(link, logoTypes[Number(logotype)]))) {
        return Promise.reject(new Error(
           MESSAGES.VALIDATION.SOCIAL_NETWORK_NOT_MATCH,
        ));
    }

    const doesLinkWithLogoTypeAlreadyExist = sourceLinks.some((obj) => obj.logoType === Number(logotype));
    if (doesLinkWithLogoTypeAlreadyExist) {
        return Promise.reject(new Error(
            MESSAGES.VALIDATION.SOCIAL_NETWORK_ALREADY_EXISTS,
        ));
    }

    return Promise.resolve();
}

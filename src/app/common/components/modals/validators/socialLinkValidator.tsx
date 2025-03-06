/* eslint-disable import/extensions */
import VALIDATION_MESSAGES from '@/app/common/constants/validation-messages.constants';
import { doesUrlContainSiteName } from '@/app/common/utils/checkUrl';
import SocialItem from '@/models/social-link/socialItem';

export default function validateSocialLink<T>(
    link: string,
    socialOptions: SocialItem<T>[],
    logoTypes: string[],
    sourceLinks: { logoType: T }[],
    socialName: string,
): Promise<unknown> {
    const logotype = socialOptions.find((opt) => opt.value === socialName)?.logo;
    if (logotype === undefined // we need this explicit check because it can pass when logotype is 0
        || logotype === null
        || (!doesUrlContainSiteName(link, logoTypes[Number(logotype)]))) {
        return Promise.reject(new Error(
            VALIDATION_MESSAGES.INVALID_SOCIAL_LINK,
        ));
    }

    const doesLinkWithLogoTypeAlreadyExist = sourceLinks.some((obj) => obj.logoType === Number(logotype));
    if (doesLinkWithLogoTypeAlreadyExist) {
        return Promise.reject(new Error(
            VALIDATION_MESSAGES.DUPLICATE_SOCIAL_NETWORK,
        ));
    }

    return Promise.resolve();
}

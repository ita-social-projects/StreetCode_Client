export const isValidUrl = (url: string): boolean => {
    try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

export const isInvalidUrl = (url: string): boolean => !isValidUrl(url);

export const doesUrlContainSiteName = (link: string, siteName: string): boolean => {
    let pattern: string;
    if (siteName.toLowerCase() === 'youtube') {
        pattern = '^https?:\\/\\/(www\\.)?(youtube\\.com|youtu\\.be)\\/?.*$';
    } else {
        pattern = `^https?:\\/\\/(www\\.)?(?:[a-zA-Z0-9-]+\\.)?${siteName}\\.[a-zA-Z]{2,6}\\/?.*$`;
    }
    const regex = new RegExp(pattern);
    return regex.test(link);
};

export const removeHtmlTags = (content: string | null) => {
    if (!content) {
        return '';
    }

    return content.replace(/<[^>]*>|&nbsp;/g, (match) => {
        if (match === '&nbsp;') return ' ';
        return '';
    });
};

export const refactorIndentsHtml = (content: string | null) => content?.replace(/\n/g, '<p><br></p>') ?? '';

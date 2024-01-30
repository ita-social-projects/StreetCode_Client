export const removeHtmlTags = (content: string | null) => {
    if (!content) {
        return '';
    }

    return content.replace(/<[^>]*>|&nbsp;/g, (match) => {
        if (match === '&nbsp;') return ' ';
        return '';
    });
};

export const formatIndentsWithoutLists = (content: string | null) => content?.replace(/\n/g, '<p><br></p>') ?? '';

export const refactorIndentsHtml = (content: string | null) => {
    if (!content) {
        return '';
    }

    if (!content.includes('<li')) {
        return formatIndentsWithoutLists(content);
    }

    const excludeListsPattern = /(?:^|<\/(?:ul|ol)>)[\s\S]*?(?=<(?:ul|ol)>|$)/g;
    const refactoredText = content.replace(excludeListsPattern, (match) => formatIndentsWithoutLists(match));
    return refactoredText;
};

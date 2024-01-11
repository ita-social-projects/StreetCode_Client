export const removeHtmlTags = (content: string) => content.replace(/<[^>]*>|&nbsp;/g, (match) => {
    if (match === '&nbsp;') return ' ';
    return '';
});

export const indentsBetweenParagraphsHtml = (content: string) => content.replace(/\n/g, '<p><br></p>');

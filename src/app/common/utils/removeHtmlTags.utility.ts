const removeHtmlTags = (content: string) => content.replace(/<[^>]*>|&nbsp;/g, (match) => {
    if (match === '&nbsp;') return ' ';
    return '';
});

export default removeHtmlTags;

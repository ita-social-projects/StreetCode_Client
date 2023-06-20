import ReactGA from 'react-ga4';

export const instagramOnStreetcodeClickEvent = (from: string) => ReactGA.event('instabutton_click', {
    method: `${from}`,
});
export const relatedFiguresLeaveEvent = () => ReactGA.event('relatedfigures_leave', {
    to: 'another_streetcode',
});
export const relatedFiguresTagsEvent = (tag: string) => ReactGA.event('relatedfigures_tag_click', {
    tagname: `${tag}`,
});
export const audioClickEvent = (streetcodeId : number) => ReactGA.event('audio_click', {
    streetcodeId: `${streetcodeId}`,
});
export const personLiveEvent = (streetcodeId : number) => ReactGA.event('person_live', {
    streetcodeId: `${streetcodeId}`,
});
export const donateEvent = (from: string) => ReactGA.event('donate_button_click', {
    method: `${from}`,
});
export const supportEvent = (from: string) => ReactGA.event('support_button_click', {
    method: `${from}`,
});
export const becomePartnerEvent = (from: string) => ReactGA.event('become_partner_button_click', {
    method: `${from}`,
});
export const toArticleRedirectClickEvent = (articleName: string, from: string) => ReactGA.event(
    'to_article_redirect_click',
    {
        article: `${articleName}`,
        from: `${from}`,
    },
);
export const toStreetcodeRedirectClickEvent = (streetcodeName: string, from: string) => ReactGA.event(
    'to_streetcode_redirect_click',
    {
        streetcode: `${streetcodeName}`,
        from: `${from}`,
    },
);
export const toInstaPostRedirectClickEvent = (streetcodeName: string, from: string) => ReactGA.event(
    '',
    {
        article: `${streetcodeName}`,
        from: `${from}`,
    },
);
export const partnersClickEvent = () => ReactGA.event('partners_button_click');
export const submitModalPartnersClickEvent = () => ReactGA.event('submit_become_parter');
export const joinToStreetcodeClickEvent = () => ReactGA.event('join_to_comunity_button_click');
export const copyBankNumberEvent = () => ReactGA.event('copy_bank_number_button_click');
export const moreTextEvent = () => ReactGA.event('text_more_button_click');
export const nextArticleClickEvent = () => ReactGA.event('next_article_button_click');
export const prevArticleClickEvent = () => ReactGA.event('prev_article_button_click');
export const alsoReadArticleClickEvent = () => ReactGA.event('also_read_news_page_button_click');

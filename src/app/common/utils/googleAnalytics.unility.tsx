import ReactGA from 'react-ga4';

export const instagramClickEvent = (from: string) => ReactGA.event('instabutton_click', {
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
export const catalogItem = (streetcodeId : number) => ReactGA.event('catalog_item_click', {
    streetcodeId: `${streetcodeId}`,
});
export const partnersClickEvent = () => ReactGA.event('partners_button_click');
export const submitModalPartnersClickEvent = () => ReactGA.event('submit_become_parter');
export const joinToStreetcode = () => ReactGA.event('join_to_comunity_button_click');
export const copyBankNumber = () => ReactGA.event('copy_bank_number');
export const moreTextEvent = () => ReactGA.event('text_more');

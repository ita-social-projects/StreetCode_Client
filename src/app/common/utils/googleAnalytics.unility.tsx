import ReactGA from 'react-ga4';

export const instagramClickEvent = (from: string) => ReactGA.event('instabutton_click', { method: `${from}` });
export const relatedFiguresLeaveEvent = () => ReactGA.event('relatedfigures_leave', { to: 'another_streetcode' });
export const relatedFiguresTagsEvent = (tag: string) => ReactGA.event('relatedfigures_tagclick', { tagname: `${tag}` });
export const audioClickEvent = (streetcodeId : number) => ReactGA.event('audio_click', {
    streetcodeId: `${streetcodeId}`,
});
export const moreTextEvent = () => ReactGA.event('text_more');
export const personLiveEvent = (streetcodeId : number) => ReactGA.event(
    'person_live',
    {
        streetcodeId: `${streetcodeId}`,
    },
);
export const donateEvent = (from: string) => ReactGA.event('donate_click', { method: `${from}` });
export const supportEvent = (from: string) => ReactGA.event('support_click', { method: `${from}` });
export const becomePartnerEvent = (from: string) => ReactGA.event('become_partner_click', { method: `${from}` });
export const partnersClickEvent = () => ReactGA.event('partners_click');
export const submitModalPartnersClickEvent = () => ReactGA.event('submit_becomeparter');
export const joinToStreetcode = () => ReactGA.event('join_to_comunity');

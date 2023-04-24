import ReactGA from 'react-ga4';

export const instagramClick = (from: string) => ReactGA.event('instabutton_click', { method: `${from}` });
export const relatedFiguresLeave = () => ReactGA.event('relatedfigures_leave', { to: 'another_streetcode' });
export const relatedFiguresTags = (tag: string) => ReactGA.event('relatedfigures_tagclick', { tagname: `${tag}` });
export const audioClick = (streetcodeId : number) => ReactGA.event('audio_click', { streetcodeId: `${streetcodeId}` });
export const moreText = () => ReactGA.event('text_more');
export const personLive = (streetcodeId : number) => ReactGA.event('person_live', { streetcodeId: `${streetcodeId}` });
export const donate = (from: string) => ReactGA.event('donate_click', { method: `${from}` });
export const support = (from: string) => ReactGA.event('support_click', { method: `${from}` });
export const becomePartner = (from: string) => ReactGA.event('become_partner_click', { method: `${from}` });
export const partners = () => ReactGA.event('partners_click');
export const submitModalPartners = () => ReactGA.event('submit_becomeparter');

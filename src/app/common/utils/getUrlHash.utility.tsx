const getUrlHash = (location: Location): string => location.hash.replace('#', '');
export default getUrlHash;

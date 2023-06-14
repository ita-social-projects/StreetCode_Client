const getMaxId = (array: number[]): number => array.reduce((max, item) => (item > max ? item : max), 0) + 1;
export default getMaxId;

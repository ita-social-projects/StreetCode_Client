const getNewMinNegativeId = (arr: number[]):number => {
    if (arr.length > 0) {
        const min = Math.min(...arr);
        if (min < 0) {
            return min - 1;
        }
    }
    return -1;
};
export default getNewMinNegativeId;

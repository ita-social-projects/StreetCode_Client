export const StringComparator: IComparator<string> = {
    compare: (a, b) => a.localeCompare(b),
};

export const NumberComparator: IComparator<number> = {
    compare: (a, b) => a - b,
};

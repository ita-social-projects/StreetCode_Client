import { useState } from 'react';

export enum SortDirection {
    Unsorted,
    Ascend,
    Descend,
}

const useSortDirection = () => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Unsorted);

    const toggleSort = () => {
        setSortDirection((prev) => {
            if (prev === SortDirection.Unsorted) return SortDirection.Ascend;
            if (prev === SortDirection.Ascend) return SortDirection.Descend;
            return SortDirection.Unsorted;
        });
    };

    return { sortDirection, toggleSort };
};

export default useSortDirection;

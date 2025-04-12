import { useState } from 'react';

export enum SortDirection {
    Unsorted,
    Ascend,
    Descend,
}

const useSortDirection = () => {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Unsorted);

    const toggleSort = (key: string) => {
        if (key === activeKey) {
            setSortDirection((prev) => {
                if (prev === SortDirection.Unsorted) return SortDirection.Ascend;
                if (prev === SortDirection.Ascend) return SortDirection.Descend;
                return SortDirection.Unsorted;
            });
        } else {
            setActiveKey(key);
            setSortDirection(SortDirection.Ascend);
        }
    };

    return { sortDirection, toggleSort, activeKey };
};

export default useSortDirection;

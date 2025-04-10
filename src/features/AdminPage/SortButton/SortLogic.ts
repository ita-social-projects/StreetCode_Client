import { SortDirection } from '@features/AdminPage/SortButton/useSortDirection';

function SortData<T>(
    dataSource: T[],
    sortDirection: SortDirection,
    selector: (item: T) => string,
): T[] {
    if (sortDirection === SortDirection.Unsorted) return dataSource || [];

    const sortedArray = [...(dataSource || [])];

    sortedArray.sort((left, right) => {
        const leftValue = selector(left);
        const rightValue = selector(right);

        if (sortDirection === SortDirection.Ascend) {
            return leftValue.localeCompare(rightValue);
        }
        if (sortDirection === SortDirection.Descend) {
            return rightValue.localeCompare(leftValue);
        }
        return 0;
    });

    return sortedArray;
}

export default SortData;

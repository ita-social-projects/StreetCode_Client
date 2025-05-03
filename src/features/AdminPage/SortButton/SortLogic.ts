import { SortDirection } from '@features/AdminPage/SortButton/useSortDirection';

function SortData<T, V>(
    dataSource: T[],
    sortDirection: SortDirection,
    selector: (item: T) => V,
    comparator: IComparator<V>,
): T[] {
    if (sortDirection === SortDirection.Unsorted) return dataSource || [];

    const sortedArray = [...(dataSource || [])];

    sortedArray.sort((left, right) => {
        const result = comparator.compare(selector(left), selector(right));
        return sortDirection === SortDirection.Ascend ? result : -result;
    });

    return sortedArray;
}

export default SortData;

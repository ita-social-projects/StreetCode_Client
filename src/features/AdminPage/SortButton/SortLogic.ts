import { SortDirection } from '@features/AdminPage/SortButton/SortButton';

function SortData(dataSource: any[], sortDirection: SortDirection) : any[] {
    if (sortDirection === SortDirection.Unsorted) return dataSource || [];

    const sortedArray = [...(dataSource || [])];

    sortedArray.sort((left, right) => {
        if (sortDirection === SortDirection.Ascend) {
            return left.title.localeCompare(right.title);
        }
        if (sortDirection === SortDirection.Descend) {
            return right.title.localeCompare(left.title);
        }
        return 0;
    });

    return sortedArray;
}

export default SortData;

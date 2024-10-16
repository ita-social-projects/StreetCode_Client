// eslint-disable-next-line import/prefer-default-export
export function paginateRequest(
    pageSize: number,
    request: (page: number, pageSize: number, args: any) => Promise<any>,
    args: any,
) {
    let page = 1;

    const fetchNextPage = async () => {
        const currentPage = page;
        const response = await request(currentPage, pageSize, args).catch((error) => {
            console.error(error);
        });

        if (response.length === 0) {
            throw new Error('No more data to load');
        }

        page = currentPage + 1;
        return [response, (currentPage - 1) * pageSize, currentPage * pageSize];
    };

    return { fetchNextPage };
}

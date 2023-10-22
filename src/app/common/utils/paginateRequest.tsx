export function paginateRequest (pageSize: number, request: (page: number, pageSize: number, args: any) => Promise<any>, args: {}){
    let page = 1;

    const fetchNextPage = async () => {
        const currentPage = page;
        const response = await request(currentPage, pageSize, args).catch((error) => {
            console.error("Error in request:", error);
          });

        if (response.length > 0) {
            page = currentPage + 1;
            return response;
        }
        else {
            throw new Error('No more data to load');
        }
    };

    return { fetchNextPage };
}
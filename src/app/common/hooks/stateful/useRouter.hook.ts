import { useMemo } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

export const useRouteUrl = () => {
    const params = useParams<{ id: string }>();
    return params.id ?? '404';
};

const useRouter = <T extends Record<string, string | undefined> | string> () => {
    const params = useParams<T>();
    const location = useLocation();

    return useMemo(
        () => ({
            query: {
                ...params,
                queryString: location.search,
                parsedQueryString: new URLSearchParams(location.search),
            },
            location: {
                ...location,
            },
        }),
        [params, location],
    );
};

export default useRouter;

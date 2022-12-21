import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as queryString from "querystring";

const useRouter = <T extends {} | string = any> () => {
    const params = useParams<T>();
    const location = useLocation();

    return useMemo(() => ({
            // /?sort=popular&topic=react -> { topic: "react", sort: "popular" }
            query: {
                ...queryString.parse(location.search),
                ...params,
            },
            location,
        }),
        [params, location]
    );
}



export default useRouter;
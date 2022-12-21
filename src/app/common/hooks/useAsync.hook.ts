import { useCallback, useEffect, useState } from "react";

export const useAsync = (func: Function, deps: any[] = []) => {
    const { execute, ...state } = useAsyncInternal(func, deps);

    useEffect(() => {
        execute().then();
    }, [execute]);

    return state;
}

export const useAsyncFn = (func: Function, deps: any[] = []) => {
    return useAsyncInternal(func, deps, false);
}

const useAsyncInternal = (func: Function, deps: any[] = [], initialLoading = true) => {
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState<any | undefined>();
    const [value, setValue] = useState<any | undefined>();

    const execute = useCallback(async (...params: any[]) => {
        setLoading(true);

        try {
            const data = await func(...params);

            setValue(data);
            setError(undefined);

            return data;
        } catch (error: any) {
            setError(error);
            setValue(undefined);

            return Promise.reject(error);
        }
        finally {
            setLoading(false);
        }

    }, deps);

    return { loading, error, value, execute };
}
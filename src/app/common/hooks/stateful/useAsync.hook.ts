import { DependencyList, useCallback, useEffect, useState } from 'react';

export const useAsync = (func: Function, deps: DependencyList = [], cb?: () => void) => {
    const { execute, ...state } = useAsyncInternal(func, deps);

    useEffect(() => {
        execute().then(data => cb ?? (() => console.log(data)));
    }, [cb, execute]);

    return state;
}

export const useAsyncFn = (func: Function, deps: DependencyList = []) => {
    return useAsyncInternal(func, deps, false);
}

const useAsyncInternal = (func: Function, deps: DependencyList = [], initialLoading = true) => {
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, func]);

    return { loading, error, value, execute };
}
import { useCallback, useEffect, useState } from 'react';

const useStorageInternal = (key: string, defValue?: () => any | any, storage: Storage = window.localStorage) => {
    const [value, setValue] = useState(() => {
        const jsonValue = storage.getItem(key);

        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }

        return (defValue instanceof Function) ? defValue() : defValue;
    });

    useEffect(() => {
        if (value === undefined) {
            return storage.removeItem(key);
        }

        storage.setItem(key, JSON.stringify(value));
    }, [key, storage, value]);

    const removeValue = useCallback(
        () => setValue(undefined),
        [],
    );

    return { value, setValue, removeValue };
};

export const useLocalStorage = (key: string, defValue?: () => any | any) => useStorageInternal(
    key,
    defValue,
);

export const useSessionStorage = (key: string, defValue?: () => any | any) => useStorageInternal(
    key,
    defValue,
    window.sessionStorage,
);

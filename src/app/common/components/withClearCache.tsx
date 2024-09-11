/* eslint-disable no-underscore-dangle */
import { Component, useEffect, useState } from 'react';

const WithClearCache: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState<boolean>(false);

    const refreshCacheAndReload = () => {
        if (caches) {
            caches.keys().then((names) => {
                for (const name of names) {
                    caches.delete(name);
                }
            });
        }
        window.location.reload();
    };

    useEffect(() => {
        const localVersion = localStorage.getItem('VERSION');
        const isVersionMatches = localVersion === window._env_.VERSION;
        setIsLatestBuildDate(isVersionMatches);
        if (!isVersionMatches) {
            localStorage.setItem('VERSION', window._env_.VERSION);
            refreshCacheAndReload();
        }
    }, []);

    if (isLatestBuildDate) {
        return children;
    }
    return null;
};

export default WithClearCache;

import { useCallback, useState } from 'react';

const useImageLoader = () => {
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const handleImageLoad = useCallback((): void => {
        setLoadedImagesCount((prevCount) => prevCount + 1);
    }, [setLoadedImagesCount]);

    return [loadedImagesCount, handleImageLoad];
};

export default useImageLoader;

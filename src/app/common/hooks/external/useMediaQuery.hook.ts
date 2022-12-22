import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaList = window.matchMedia(query);

        if (mediaList.matches !== matches) {
            setMatches(mediaList.matches);
        }

        const listener = () => setMatches(mediaList.matches);
        window.addEventListener('resize', listener);

        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
}

export default useMediaQuery;
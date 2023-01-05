import { useEffect, useState } from 'react';

/*
Ex.
  export default function Component() {
      const matches = useMediaQuery('max-width', '768px');

      return (
        <div>
          {`The view port is ${matches ? 'at least' : 'less than'} 768 pixels wide`}
        </div>
      );
  }
*/
type MediaDirection = 'min-width' | 'max-width';

const useMediaQuery = (value: number | string, direction: MediaDirection = 'min-width', unit = 'px') => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof value === 'string') {
            parseInt((value.endsWith(unit)) ? value.replace(unit, '') : value, 10);
        }

        const mediaList = window.matchMedia(`(${direction}: ${value})`);

        if (mediaList.matches !== matches) {
            setMatches(mediaList.matches);
        }

        const listener = () => setMatches(mediaList.matches);
        window.addEventListener('resize', listener);

        return () => window.removeEventListener('resize', listener);
    }, [matches, direction, unit, value]);

    return matches;
};

export default useMediaQuery;

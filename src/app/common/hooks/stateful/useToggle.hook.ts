import { useMemo, useState } from 'react';

const useToggle = (initialToggleState = false) => {
    const [toggleState, setToggleState] = useState(initialToggleState);

    const handlers = useMemo(() => ({
        on: () => setToggleState(true),
        off: () => setToggleState(false),
        toggle: () => setToggleState((prev) => !prev),
    }), []);

    return { toggleState, handlers };
};

export default useToggle;

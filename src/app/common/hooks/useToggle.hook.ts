import { useMemo, useState } from "react";

const useToggle = () => {
  const [toggleState, setToggleState] = useState(false);

  const handlers = useMemo(() => ({
      on: () => setToggleState(true),
      off: () => setToggleState(false),
      toggle: () => setToggleState(prev => !prev),
  }), []);

  return { toggleState, handlers };
}

export default useToggle;
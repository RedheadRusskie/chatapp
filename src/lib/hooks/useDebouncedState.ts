import { useState } from "react";
import { debounce } from "lodash-es";

export const useDebouncedState = <T>(
  initialState: T | (() => T),
  delay?: number
) => {
  const [state, setState] = useState(initialState);

  const debouncedSetState = debounce(setState, delay);

  return [state, debouncedSetState] as const;
};

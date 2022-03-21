import { useReducer } from "react";

const initialInputState = {
  value: "",
  willCheck: false
};

const inputStateReducer = (state, action) => {
  if (action.type === "CHANGE") {
    return { willCheck: true, value: action.value === null ? state.value : action.value };
  }
  if (action.type === "BLUR") {
    return { willCheck: true, value: state.value };
  }
  if (action.type === "FOCUS") {
    return { willCheck: false, value: state.value };
  }
  if (action.type === "RESET") {
    return { willCheck: false, value: "" };
  }
  return initialInputState;
};

const useValidateInput = (formatValue = () => {}, validateValue = () => {}) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, initialInputState);

  const error = inputState.willCheck ? validateValue(inputState.value) : null;

  const onChange = (event) => {
    dispatch({ type: "CHANGE", value: formatValue(event) });
  };

  const onBlur = () => {
    dispatch({ type: "BLUR" });
  };

  const onFocus = () => {
    dispatch({ type: "FOCUS" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return {
    value: inputState.value,
    error,
    onChange,
    onBlur,
    onFocus,
    reset
  };
};

export default useValidateInput;
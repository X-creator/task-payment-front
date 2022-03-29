import { useReducer } from "react";

let inputs = null;
let savedConfig = null;

const init = (config) => {
  savedConfig = config;

  inputs = Object.fromEntries(
    Object.entries(config)
      .map(([inputName]) => [inputName, { value: "", error: null }])
  );

  return {
    state: "initial"
  };
};

const changeInputValue = (inputValue, inputName) => {
  const formatter = savedConfig[inputName][0];
  const value = formatter(inputValue);
  if (value !== null) {
    inputs[inputName].value = value;
  }
};

const changeInputState = (willCheck, inputName) => {
  let error = null;
  if (willCheck) {
    const validator = savedConfig[inputName][1];
    error = validator(inputs[inputName].value);
  }
  inputs[inputName].error = error;
};


const formStateReducer = (_, { type, input }) => {
  switch (type) {
    case "CHANGE":
      changeInputValue(input.value, input.name);
      changeInputState(true, input.name);
      return {
        state: "changed"
      };
    case "BLUR":
      changeInputState(true, input.name);
      return {
        state: "blurred"
      };
    case "FOCUS":
      changeInputState(false, input.name);
      return {
        state: "focused"
      };
    case "RESET":
      return init(savedConfig);
    default:
      throw new Error();
  }
};


const useForm = (config) => {
  const [_, dispatch] = useReducer(formStateReducer, config, init);

  const onChange = ({ target: { name, value } }) => {
    dispatch({ type: "CHANGE", input: { name, value } });
  };

  const onBlur = ({ target: { name } }) => {
    dispatch({ type: "BLUR", input: { name } });
  };

  const onFocus = ({ target: { name } }) => {
    dispatch({ type: "FOCUS", input: { name } });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return {
    inputs,
    onChange,
    onBlur,
    onFocus,
    reset
  };
};
export default useForm;

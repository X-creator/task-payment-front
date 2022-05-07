import { useReducer } from "react";

let inputs = null;
let savedConfig = null;

const init = (config) => {
  savedConfig = config;

  inputs = resetForm();

  return {
    state: "RESET"
  };
};

const resetForm = () => {
  return Object.fromEntries(
    Object.entries(savedConfig)
      .map(([inputName]) => [inputName, { value: "", error: null }])
  );
};

const formatInputValue = (inputValue, inputName) => {
  const { formatter } = savedConfig[inputName];
  const value = formatter(inputValue);
  if (value !== null) {
    inputs[inputName].value = value;
  }
};

const validateInputValue = (willCheck, inputName) => {
  let error = null;
  if (willCheck) {
    const { validator } = savedConfig[inputName];
    error = validator(inputs[inputName].value);
  }
  inputs[inputName].error = error;
};


const formStateReducer = (_, { type, input }) => {
  switch (type) {
    case "CHANGE":
    case "BLUR":
    case "FOCUS":
    case "RESET":
      return {
        state: type
      };
    default:
      throw new Error();
  }
};


const useForm = (config) => {
  const [_, dispatch] = useReducer(formStateReducer, config, init);

  const onChange = ({ target: { name, value } }) => {
    formatInputValue(value, name);
    validateInputValue(true, name);
    dispatch({ type: "CHANGE" });
  };

  const onBlur = ({ target: { name } }) => {
    validateInputValue(true, name);
    dispatch({ type: "BLUR" });
  };

  const onFocus = ({ target: { name } }) => {
    validateInputValue(false, name);
    dispatch({ type: "FOCUS" });
  };

  const reset = () => {
    inputs = resetForm();
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

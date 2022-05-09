import { useReducer } from "react";

let savedConfig = null,
  isFulfilled = false;

const init = (config) => {
  savedConfig = config;
  return resetForm();
};

const resetForm = () => {
  return Object.fromEntries(
    Object.entries(savedConfig)
      .map(([inputName]) => (
        [inputName,
          {
            value: "",
            error: null,
            isTouched: false,
            isFocused: false
          }
        ]
      )));
};

const calcFormError = (state) => {
  return Object.entries(state)
    .map(([_, { error, isTouched }]) => error || !isTouched)
    .some((isFalsy) => Boolean(isFalsy));
};

const formatInputValue = (inputName, inputValue) => {
  const { formatter } = savedConfig[inputName];
  return formatter(inputValue);
};

const validateInputValue = (inputName, inputValue) => {
  const { validator } = savedConfig[inputName];
  return validator(inputValue);
};


const formStateReducer = (state, { type, inputName, inputValue }) => {
  let errorMessage;
  switch (type) {
    case "CHANGE":
      const formattedValue = formatInputValue(inputName, inputValue);
      const value = formattedValue === null ? state[inputName].value : formattedValue;
      errorMessage = validateInputValue(inputName, value);
      return {
        ...state,
        [inputName]: {
          value,
          error: errorMessage,
          isTouched: true,
          isFocused: false
        }
      };
    case "BLUR":
    case "FOCUS":
      errorMessage = validateInputValue(inputName, inputValue);
      return {
        ...state,
        [inputName]: {
          value: state[inputName].value,
          error: errorMessage,
          isTouched: true,
          isFocused: type === "FOCUS"
        }
      };
    case "RESET":
      return resetForm();
    default:
      throw new Error();
  }
};

const useForm = (config) => {
  const [inputs, dispatch] = useReducer(formStateReducer, config, init);
  isFulfilled = !calcFormError(inputs);

  const onChange = ({ target: { name, value } }) => {
    dispatch({ type: "CHANGE", inputName: name, inputValue: value });
  };

  const onBlur = ({ target: { name, value } }) => {
    dispatch({ type: "BLUR", inputName: name, inputValue: value });
  };

  const onFocus = ({ target: { name, value } }) => {
    dispatch({ type: "FOCUS", inputName: name, inputValue: value });
  };

  const reset = () => {
    isFulfilled = false;
    dispatch({ type: "RESET" });
  };

  return {
    inputs,
    isFulfilled,
    actions: {
      onChange,
      onBlur,
      onFocus,
      reset
    }
  };
};

export default useForm;

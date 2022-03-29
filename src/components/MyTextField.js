import { TextField } from "@mui/material";

const MyTextField = ({ onChange, onBlur, onFocus, ...otherProps }) => {
  const wrapperHandler = (handler, e) => {
    e.target.name = otherProps.name;
    handler(e);
  };

  return (
    <TextField onChange={wrapperHandler.bind(null, onChange)}
               onBlur={wrapperHandler.bind(null, onBlur)}
               onFocus={wrapperHandler.bind(null, onFocus)}
               {...otherProps}
    />
  );
};

export default MyTextField;
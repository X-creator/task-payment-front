import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


const Notification = ({ isError, isSuccess, isLoading }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isError || Boolean(isSuccess) || isLoading);
  }, [isError, isSuccess, isLoading]);

  const onCloseHandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onCloseHandler}>
      <Alert onClose={onCloseHandler}
             variant="filled"
             sx={{ width: "100%" }}
             severity={isError ? "error" : isSuccess ? "success" : "warning"}
      >
        {isError && "Epic Fail!"}
        {isLoading && "Wait please!"}
        {isSuccess && (
          <pre>
          {JSON.stringify(isSuccess, null, 2)}
        </pre>
        )}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

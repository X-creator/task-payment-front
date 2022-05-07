import { useEffect, useState } from "react";
import MyTextField from "./MyTextField";
import Notification from "./Notification";
import useForm from "../hooks/useForm";
import useDataFetch from "../hooks/useDataFetch";
import { formHasError, formIsFulfilled } from "../helpers/validateForm";
import { formatAmount, formatCard, formatCvv, formatExpiration } from "../helpers/formatInputs";
import { validateAmount, validateCard, validateCvv, validateExpiration } from "../helpers/validateInputs";
import {
  Box,
  Button,
  Container,
  Divider,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";


const currentYear = new Date().getFullYear();

const config = {
  cvv: {
    formatter: formatCvv,
    validator: validateCvv
  },
  amount: {
    formatter: formatAmount,
    validator: validateAmount
  },
  cardNumber: {
    formatter: formatCard,
    validator: validateCard
  },
  expirationMonth: {
    formatter: formatExpiration,
    validator: validateExpiration
  },
  expirationYear: {
    formatter: formatExpiration,
    validator: validateExpiration
  }
};

const setOption = (data) => ({
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json"
  }
});

const App = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    inputs: { cvv, amount, cardNumber, expirationMonth, expirationYear },
    reset,
    ...eventHandlers
  } = useForm(config);


  const [{ isLoading, isError, responseData }, setRequestData] = useDataFetch("http://localhost:5000/", setOption);


  const keyDownHandler = (e) => {
    if (e.repeat) e.preventDefault();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());
    const formattedData = {
      amount: formData.amount.replace(/,/g, ""),
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      cvv: formData.cvv,
      expiration: {
        month: formData.expirationMonth,
        year: formData.expirationYear
      }
    };
    setRequestData(formattedData);
    reset();
  };

  const fieldsValue = [cardNumber.value, expirationMonth.value, expirationYear.value, cvv.value, amount.value];
  const fieldsError = [cardNumber.error, expirationMonth.error, expirationYear.error, cvv.error, amount.error];

  useEffect(() => {
    setIsDisabled(
      !formIsFulfilled(fieldsValue)
      || formHasError(fieldsError));
  }, [...fieldsValue, ...fieldsError]);


  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ mt: 5, p: 3 }}>
        <Typography component="h1" variant="h4" sx={{
          textAlign: "center",
          color: "darkslategrey",
          mb: 2
        }}>
          Payment
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2
        }}>
          <TextField
            required
            error={!!cardNumber.error}
            helperText={cardNumber.error}
            fullWidth
            label="Card Number"
            name="cardNumber"
            autoComplete="cc-number"
            autoFocus
            onKeyDown={keyDownHandler}
            value={cardNumber.value}
            {...eventHandlers}
          />
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <MyTextField
              sx={{ maxWidth: 130 }}
              required
              error={!!expirationMonth.error}
              select
              fullWidth
              name="expirationMonth"
              label="Exp. month"
              autoComplete="cc-exp-month"
              value={expirationMonth.value}
              {...eventHandlers}
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1))
                .map((i) =>
                  <MenuItem key={i} value={i}>{i.padStart(2, "0")}</MenuItem>
                )}
            </MyTextField>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 2 }} />
            <MyTextField
              sx={{ maxWidth: 160 }}
              select
              required
              error={!!expirationYear.error}
              fullWidth
              name="expirationYear"
              label="Exp. Year"
              autoComplete="cc-exp-year"
              value={expirationYear.value}
              {...eventHandlers}
            >
              {Array.from({ length: 10 }, (_, i) => String(currentYear + i))
                .map((i) =>
                  <MenuItem key={i} value={i}>{i}</MenuItem>
                )}
            </MyTextField>
          </Box>
          <FormHelperText error>{expirationMonth.error || expirationYear.error}</FormHelperText>
          <TextField
            sx={{ maxWidth: 100 }}
            required
            error={!!cvv.error}
            fullWidth
            name="cvv"
            label="CVV"
            autoComplete="cc-csc"
            value={cvv.value}
            onKeyDown={keyDownHandler}
            {...eventHandlers}
          />
          <FormHelperText error>{cvv.error}</FormHelperText>
          <TextField
            required
            error={!!amount.error}
            helperText={amount.error}
            fullWidth
            name="amount"
            label="Amount"
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            value={amount.value}
            onKeyDown={keyDownHandler}
            {...eventHandlers}
          />
          <Button
            sx={{ mt: 3, mb: 2, height: 46 }}
            type="submit"
            fullWidth
            disabled={isDisabled}
            variant="contained"
          >
            Pay
          </Button>
        </Box>
      </Paper>
      <Notification isLoading={isLoading} isError={isError} isSuccess={responseData} />
    </Container>
  );
};

export default App;

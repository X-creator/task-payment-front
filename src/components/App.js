import { useEffect, useState } from "react";
import useValidateInput from "../hooks/useValidateInput";
import { formatAmount, formatCard, formatCvv, formatExpiration } from "../helpers/formatInputs";
import { validateAmount, validateCard, validateCvv, validateExpiration } from "../helpers/validateInputs";
import { formHasError, formIsFulfilled } from "../helpers/validateForm";
import {
  Box,
  InputAdornment,
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
  Paper
} from "@mui/material";


const currentYear = new Date().getFullYear();


const App = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState(null);

  const {
    value: cardValue,
    error: cardError,
    onChange: cardOnChange,
    onBlur: cardOnBlur,
    onFocus: cardOnFocus,
    reset: cardReset
  } = useValidateInput(formatCard, validateCard);

  const {
    value: expirationMonthValue,
    error: expirationMonthError,
    onChange: expirationMonthOnChange,
    onBlur: expirationMonthOnBlur,
    onFocus: expirationMonthOnFocus,
    reset: expirationMonthReset
  } = useValidateInput(formatExpiration, validateExpiration);

  const {
    value: expirationYearValue,
    error: expirationYearError,
    onChange: expirationYearOnChange,
    onBlur: expirationYearOnBlur,
    onFocus: expirationYearOnFocus,
    reset: expirationYearReset
  } = useValidateInput(formatExpiration, validateExpiration);

  const {
    value: cvvValue,
    error: cvvError,
    onChange: cvvOnChange,
    onBlur: cvvOnBlur,
    onFocus: cvvOnFocus,
    reset: cvvReset
  } = useValidateInput(formatCvv, validateCvv);

  const {
    value: amountValue,
    error: amountError,
    onChange: amountOnChange,
    onBlur: amountOnBlur,
    onFocus: amountOnFocus,
    reset: amountReset
  } = useValidateInput(formatAmount, validateAmount);

  const fieldsValue = [cardValue, expirationMonthValue, expirationYearValue, cvvValue, amountValue];
  const fieldsError = [cardError, expirationMonthError, expirationYearError, cvvError, amountError];
  const resetForm = [cardReset, expirationMonthReset, expirationYearReset, cvvReset, amountReset];

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target).entries());

    const data = {
      amount: formData.amount.replace(/,/g, ""),
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      cvv: formData.cvv,
      expiration: {
        month: formData.expirationMonth,
        year: formData.expirationYear
      }
    };
    setData(data);
    resetForm.forEach(f => f());
  };

  useEffect(() => {
    if (data) {
      const sendDataHandler = async () => {
        const response = await fetch("http://localhost:5000/", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const responseData = await response.json();
        console.log(responseData);
      };
      sendDataHandler();
    }
  }, [data]);


  useEffect(() => {
    if (formIsFulfilled(fieldsValue) && !formHasError(fieldsError)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [...fieldsValue, ...fieldsError]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{
        mt: 5,
        p: 3
      }}>

        <Typography component="h1" variant="h4" sx={{
          textAlign: "center",
          mb: 2
        }}>
          Payment
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2
        }}>
          <TextField
            required
            error={!!cardError}
            helperText={cardError}
            fullWidth
            label="Card Number"
            name="cardNumber"
            autoComplete="cc-number"
            autoFocus
            value={cardValue}
            onChange={cardOnChange}
            onBlur={cardOnBlur}
            onFocus={cardOnFocus}
          />
          <Box sx={{
            width: "100%",
            display: "flex",
            justifyContents: "center",
            alignItems: "center"
          }}>
            <TextField
              sx={{ mr: 3, minWidth: 140 }}
              required
              error={!!expirationMonthError}
              helperText={expirationMonthError}
              select
              name="expirationMonth"
              label="Exp. month"
              autoComplete="cc-exp-month"
              value={expirationMonthValue}
              onChange={expirationMonthOnChange}
              onBlur={expirationMonthOnBlur}
              onFocus={expirationMonthOnFocus}
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1))
                .map((i) =>
                  <MenuItem key={i} value={i}>{i.padStart(2, "0")}</MenuItem>
                )}
            </TextField>

            <TextField
              select
              required
              error={!!expirationYearError}
              helperText={expirationYearError}
              fullWidth
              name="expirationYear"
              label="Exp. Year"
              autoComplete="cc-exp-year"
              value={expirationYearValue}
              onChange={expirationYearOnChange}
              onBlur={expirationYearOnBlur}
              onFocus={expirationYearOnFocus}
            >
              {Array.from({ length: 10 }, (_, i) => String(currentYear + i))
                .map((i) =>
                  <MenuItem key={i} value={i}>{i}</MenuItem>
                )}
            </TextField>
          </Box>

          <TextField
            sx={{ maxWidth: 100 }}
            required
            error={!!cvvError}
            helperText={cvvError}
            fullWidth
            name="cvv"
            label="CVV"
            autoComplete="cc-csc"
            value={cvvValue}
            onChange={cvvOnChange}
            onBlur={cvvOnBlur}
            onFocus={cvvOnFocus}
          />
          <TextField
            required
            error={!!amountError}
            helperText={amountError}
            fullWidth
            name="amount"
            label="Amount"
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            autoComplete="cc-csc"
            value={amountValue}
            onChange={amountOnChange}
            onBlur={amountOnBlur}
            onFocus={amountOnFocus}
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
    </Container>

  )
    ;
};

export default App;

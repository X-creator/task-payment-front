import { validateAmount, validateCard, validateCvv, validateExpiration } from "./validateInputs";

export const formIsFulfilled = (fields) => (
  !validateCard(fields[0])
  && !validateExpiration(fields[1])
  && !validateExpiration(fields[2])
  && !validateCvv(fields[3])
  && !validateAmount(fields[4])
);


export const formHasError = (fields) => fields.some((value) => Boolean(value));
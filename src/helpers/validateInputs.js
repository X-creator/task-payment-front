export const validateCard = (value) => {
  if (value.replace(/\s/g, "").length === 16) return null;
  return "The card number must be exactly 16 characters long.";
};

export const validateExpiration = (value) => {
  if (value !== "") return null;
  return "Please select an expiration date.";
};

export const validateCvv = (value) => {
  if (value.length === 3) return null;
  return "The CVV number must be exactly 3 characters long.";
};

export const validateAmount = (value) => {
  if (value !== "") return null;
  return "Please enter the payment amount.";
};

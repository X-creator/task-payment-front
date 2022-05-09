export const formatCard = (value) => {
  value = value.replace(/\s/g, "");
  if (/\D/.test(value) || value.length > 16) return null;
  return value.replace(/(\d{4})(?=\d)/g, "$1  ");
};

export const formatExpiration = (value) => value;

export const formatCvv = (value) => {
  if (/\D/.test(value) || value.length > 3) return null;
  return value;
};

export const formatAmount = (value) => {
  value = value.replace(/,/g, "");
  if (value === "" || value === "0") return "";
  if (/\D/.test(value) || value.length > 7) return null;
  return new Intl.NumberFormat("en").format(value);
};

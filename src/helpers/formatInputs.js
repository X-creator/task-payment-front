export const formatCard = (e) => {
  const value = e.target.value.replace(/\s/g, "");
  if (/\D/.test(value) || value.length > 16 && value.length !== 0) return null;
  return value.replace(/(\d{4})(?=\d)/g, "$1  ");
};


export const formatExpiration = (e) => e.target.value;


export const formatCvv = (e) => {
  const value = e.target.value;
  if (/\D/.test(value) || value.length > 3) return null;
  return value;
};


export const formatAmount = (e) => {
  const value = e.target.value.replace(/,/g, "");
  if (value === "" || value === "0") return "";
  if (/\D/.test(value) || value.length > 7) return null;
  return new Intl.NumberFormat("en").format(value);
};
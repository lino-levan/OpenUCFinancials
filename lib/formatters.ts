export const numberFormatter = new Intl.NumberFormat("en-US");

export const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (currency, el, currencies) => {
  switch (currency) {
    case "EUR":
      el.price = parseFloat((el.price * currencies.EUR).toFixed(2));
      break;
    case "TRY":
      el.price = parseFloat((el.price * currencies.TRY).toFixed(2));
      break;
    case "USD":
      el.price = parseFloat((el.price * currencies.USD).toFixed(2));
      break;
    case "GBP":
      el.price = parseFloat((el.price * currencies.GBP).toFixed(2));
      break;
  }
};

module.exports = formatPrice;

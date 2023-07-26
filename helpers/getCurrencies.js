const AppError = require("../utils/appError");
const axios = require("axios");

module.exports = getCurrencies = async () => {
  try {
    const response = await axios.get(
      `${process.env.CURRENCY_EX_URL}app_id=${process.env.APP_ID}`
    );

    const currencies = response.data.rates;

    const selectedCurrencies = {
      TRY: currencies.TRY,
      USD: currencies.USD,
      EUR: currencies.EUR,
      GBP: currencies.GBP,
    };

    return selectedCurrencies;
  } catch (e) {
    throw new AppError(
      e.response?.data?.description ?? "Something Went Wrong",
      e.response?.data?.status ?? 500
    );
  }
};

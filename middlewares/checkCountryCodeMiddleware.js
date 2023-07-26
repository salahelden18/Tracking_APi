const axios = require("axios");
const AppError = require("../utils/appError");

const checkCountryCode = async (req, res, next) => {
  const { countryCode } = req.body;
  try {
    const response = await axios.post(
      `${process.env.URL}isAvailableForCountry`,
      {
        countryCode: countryCode,
      },
      {
        headers: {
          "content-type": "application/json",
          "X-KKCI-Key": process.env.API_KEY,
        },
      }
    );

    const isAvailable = response.data?.data?.available;

    if (!isAvailable) {
      return next(new AppError(res.__("countryCodeError"), 404));
    }

    req.isAvailable = isAvailable;
    next();
  } catch (e) {
    const errorDetails = e.response?.data?.detail;
    const errorStatus = e.response?.data?.status;
    throw new AppError(
      errorDetails ?? res.__("generalError"),
      errorStatus ?? e.status
    );
  }
};

module.exports = checkCountryCode;

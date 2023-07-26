const catchAsync = require("../utils/catch_async");
const AppError = require("../utils/appError");
const axios = require("axios");
const PriceConv = require("../models/priceModel");
const formatPrice = require("../utils/formatPrice");
const getCurrencies = require("../helpers/getCurrencies");

exports.getCurrencies = catchAsync(async (req, res, next) => {
  let currencies = await PriceConv.findOne();

  // for the first time make a request to the currencies and save them into the database
  if (!currencies) {
    console.log("Entered Here For The first time");
    const selectedCurrencies = await getCurrencies();
    currencies = await PriceConv.create(selectedCurrencies);
  }

  req.currencies = currencies;

  next();
});

exports.calcPrice = catchAsync(async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.URL}calculatePriceDetailed`,
      { ...req.body, currency: "USD" },
      {
        headers: {
          "content-type": "application/json",
          "X-KKCI-Key": process.env.API_KEY,
        },
      }
    );

    const prices = response.data?.data?.spotPrices;

    // getting the lowest price
    const lowestPriceShippingOption = prices?.sort(
      (a, b) => a.price - b.price
    )[0];

    // check if the avgShipmentDays = 0 so it is not defined
    // getting the lowest duration
    let lowestShipmentDaysOption;
    if (prices[0]?.avgShipmentDay !== 0) {
      lowestShipmentDaysOption = prices?.sort(
        (a, b) => a.avgShipmentDay - b.avgShipmentDay
      )[0];
    }

    // adding lowest price before the conversion
    req.lowestPrice = lowestPriceShippingOption.price;

    prices.map((el) => {
      formatPrice(req.body.currency, el, req.currencies);
    });

    req.lowestPriceShippingOption = lowestPriceShippingOption;
    req.lowestShipmentDaysOption = lowestShipmentDaysOption;
    req.prices = prices;

    next();
  } catch (e) {
    console.log(e);
    const errorDetail = e.response?.data?.detail;
    const errorStatus = e.response?.data?.status;

    throw new AppError(
      errorDetail ?? res.__("generalError"),
      errorStatus ?? e.response?.status
    );
  }
});

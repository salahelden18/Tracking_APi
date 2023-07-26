const AppError = require("../utils/appError");
const catchAsync = require("../utils/catch_async");

const checkBody = catchAsync(async (req, res, next) => {
  req.body.currency = req.body?.currency?.toUpperCase() || "EUR";
  req.body.incoterm = req.body?.incoterm || 1;
  req.body.countryCode = req.body?.countryCode?.toUpperCase();

  const {
    tradeType,
    countryCode,
    packageProp,
    currency,
    incoterm,
    packageType,
  } = req.body;

  //check for the body
  if (!tradeType || !countryCode || !packageProp || !packageType) {
    return next(new AppError(res.__("requiredFieldsError"), 400));
  }

  if (packageType !== 1 && packageType !== 2) {
    req.body.packageType = 1; // default document will be used
  }

  // if tradetype is not 1 or 2 will automatically set to 1 import
  if (tradeType !== 1 && tradeType !== 2) {
    req.body.tradeType = 1;
  }

  // check for valid currency
  if (currency.length !== 3) {
    return next(new AppError(res.__("validCurrencyError"), 400));
  }

  // check for the valid currencies
  if (
    currency !== "USD" &&
    currency !== "EUR" &&
    currency !== "TRY" &&
    currency !== "GBP"
  ) {
    return next(new AppError(res.__("currencySupportError"), 400));
  }

  // check for incoterm
  if (incoterm !== 1 && incoterm !== 2) {
    req.body.incoterm = 1;
  }

  if (packageProp.length < 1) {
    return next(new AppError(res.__("packageError"), 400));
  }

  // check for packageProp
  packageProp.map((el) => {
    if (packageType === 1) {
      if (!el.weight || typeof el.weight !== "number") {
        return next(new AppError(res.__("weightError"), 400));
      }
    } else if (packageType === 2) {
      if (
        !el.weight ||
        typeof el.weight !== "number" ||
        !el.height ||
        typeof el.height !== "number" ||
        !el.width ||
        typeof el.width !== "number" ||
        !el.length ||
        typeof el.length !== "number"
      ) {
        return next(new AppError(res.__("weightLengthEtcError"), 400));
      }
    } else {
      return next(new AppError(res.__("typeError"), 400));
    }
  });

  next();
});

module.exports = checkBody;

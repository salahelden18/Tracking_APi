const Calc = require("../models/calcModel");
const catchAsync = require("../utils/catch_async");
const APIFeatures = require("../utils/api-features");

exports.saveInDB = catchAsync(async (req, res, next) => {
  await Calc.create({
    ...req.body,
    lowestPrice: parseFloat((req.lowestPrice * req.currencies.EUR).toFixed(2)),
    carrierCompany: req.lowestPriceShippingOption.firmName,
  });

  res.status(200).json({
    status: res.__("success"),
    currency: req.body.currency,
    lowestPrice: req.lowestPriceShippingOption,
    lowestShipmentDays: req.lowestShipmentDaysOption ?? null,
    data: req.prices ?? null,
  });
});

// get the info from the db
exports.getDbInfo = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Calc.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const calcs = await features.query.populate("packageProp");

  res.status(200).json({
    status: res.__("success"),
    results: calcs.length,
    data: calcs,
  });
});

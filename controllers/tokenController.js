const Token = require("../models/tokenModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catch_async");
const { obtainNewFedExToken } = require("../middlewares/fedexMiddlewares");
const { obtainNewUpsToken } = require("../middlewares/upsMiddlewares");

exports.checkBody = (req, res, next) => {
  const { trackingNumber, carrierCompany } = req.body;
  console.log(trackingNumber, carrierCompany);

  if (!trackingNumber || !carrierCompany) {
    return next(
      new AppError("Tracking Number and Carrier Company name is required", 400)
    );
  }

  console.log(carrierCompany.toUpperCase() === "DHL");

  if (
    carrierCompany.toUpperCase() !== "UPS" &&
    carrierCompany.toUpperCase() !== "DHL" &&
    carrierCompany.toUpperCase() !== "FEDEX" &&
    carrierCompany.toUpperCase() !== "CARGOMINI"
  ) {
    console.log("Condition failed");
    return next(
      new AppError("Only Ups, DHL, CargoMini and FedEx are allowed", 400)
    );
  }

  req.body.carrierCompany = carrierCompany.toUpperCase();

  next();
};

exports.getToken = catchAsync(async (req, res, next) => {
  console.log("Token Entered");
  const { carrierCompany } = req.body;

  let token = await Token.findOne({ carrierCompany });

  let tokenInfo;

  if (token && token.checkToken(token)) {
    tokenInfo = token;
  } else {
    let newToken;

    // directing the request in which company
    if (carrierCompany === "FEDEX") {
      console.log("No Token Exist Created New One");
      newToken = await obtainNewFedExToken();
      console.log(newToken);
    } else if (carrierCompany === "UPS") {
      newToken = await obtainNewUpsToken();
    } else if (carrierCompany === "DHL" || carrierCompany === "CARGOMINI") {
      // no need for token in dhl
      return next();
    }

    if (token) {
      // updating the token avoid creating new ones
      token.token = newToken.token;
      token.expireDate = newToken.expireDate;
      token = await token.save();
    } else {
      // create token if no one exist
      token = await Token.create({ ...newToken, carrierCompany });
    }
    tokenInfo = token;
  }

  req.tokenInfo = tokenInfo;

  next();
});

const Tracking = require("../models/trackingModel");
const catchAsync = require("../utils/catch_async");
const { trackUPSRequest } = require("../middlewares/upsMiddlewares");
const { trackFedExRequest } = require("../middlewares/fedexMiddlewares");
const { trackDhlRequest } = require("../middlewares/dhlMiddlewares");
const {
  trackCargoMiniRequest,
} = require("../middlewares/cargoMiniMiddlewares");
const formatData = require("../utils/formatResponse");
const {
  getTheAssociatedKeyWithTheValue,
  formatTheStatusIntoUserReadableString,
} = require("../utils/helperFunctions");

async function mapRequestToWhichCarrierCompanyAndFormatData(
  trackingNumber,
  carrierCompany,
  req,
  res,
  language
) {
  try {
    let data;
    if (carrierCompany === "FEDEX") {
      data = await trackFedExRequest(
        trackingNumber,
        req.tokenInfo.token,
        language
      );
    } else if (carrierCompany === "UPS") {
      console.log("Here in UPS");
      data = await trackUPSRequest(
        trackingNumber,
        req.tokenInfo.token,
        language
      );
    } else if (carrierCompany === "DHL") {
      console.log("Entered Here The tracking DHL");
      data = await trackDhlRequest(trackingNumber, language);
    } else if (carrierCompany === "CARGOMINI") {
      data = await trackCargoMiniRequest(trackingNumber);
    }

    data = formatData(carrierCompany, data, res);

    return data;
  } catch (e) {
    throw e;
  }
}

exports.trackShipment = catchAsync(async (req, res, next) => {
  const { trackingNumber, carrierCompany } = req.body;
  const language = req.headers["accept-language"];

  let data = await mapRequestToWhichCarrierCompanyAndFormatData(
    trackingNumber,
    carrierCompany,
    req,
    res,
    language
  );
  console.log(data.lastStatus);

  // 2- find if we have a record with the same tracking number and the carrier company
  let track = await Tracking.findOneAndUpdate(
    { trackingNumber, carrierCompany },
    {
      status: data.lastStatus,
      description: data.data[0].description,
      $inc: { count: 1 },
      $push: { requestsDate: Date.now() },
    },
    { upsert: true, new: true }
  );

  // convert the status into readable format instead of number
  data.lastStatus = getTheAssociatedKeyWithTheValue(data.lastStatus);

  res.status(200).json({
    status: "success",
    requestInfo: {
      carrierCompany: track.carrierCompany,
      trackingNumber: track.trackingNumber,
      description: track.description,
    },
    events: {
      lastStatus: res.__(data.lastStatus),
      data: data.data,
    },
  });
});

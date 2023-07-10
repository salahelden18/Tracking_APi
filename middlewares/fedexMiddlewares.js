const axios = require("axios");
const mapCodeIntoStatusCodeFedEx = require("../utils/fedexMapCodeIntoStatusCode");
const AppError = require("../utils/appError");
const ShipmentEvents = require("../utils/shippmentEvents");

exports.obtainNewFedExToken = async () => {
  console.log("Entered To Get Token");
  const url = process.env.TEST_URL;
  try {
    const data = new URLSearchParams();
    data.append("grant_type", process.env.GRANT_TYPE);
    data.append("client_id", process.env.CLIENT_ID);
    data.append("client_secret", process.env.CLIENT_SECRET);

    console.log("Entered Here From The Token Creatioon");

    const response = await axios.post(`${url}/oauth/token`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("after Sending the response");
    console.log(response);

    const currentTime = new Date();
    const expiryDateTime = new Date(
      currentTime.getTime() + response.data["expires_in"] * 1000
    );

    return {
      token: response.data["access_token"],
      expireDate: expiryDateTime,
    };
  } catch (error) {
    throw new AppError(
      error.response.data.errors[0].message,
      error.response.status
    );
  }
};

exports.trackFedExRequest = async (trackingNumber, token, language) => {
  console.log("Entered The Fedex Request Here");
  const url = process.env.TEST_URL;
  const dataBody = {
    includeDetailedScans: true,
    trackingInfo: [
      {
        trackingNumberInfo: {
          trackingNumber,
        },
      },
    ],
  };

  let locale;

  if (language === "en") {
    locale = "en_US";
  } else if (language === "tr") {
    locale = "tr_TR";
  } else if (language === "ar") {
    locale = "ar_AE";
  } else {
    locale = "en_US";
  }

  try {
    const response = await axios.post(
      `${url}/track/v1/trackingnumbers`,
      dataBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // checking for errors that does not trigger the catch block
    const haveError =
      response.data.output.completeTrackResults[0].trackResults[0].error;

    if (haveError) {
      throw haveError;
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data !== undefined) {
      throw new AppError(
        error.response.data.errors[0].message,
        error.response.status
      );
    }

    // if it is an error that is not directly caught by the catch block (Fedex logic)
    // mostly the Not Found Exception in not caught and this is a work around that
    if (error.message && error.code) {
      const statusCode = mapCodeIntoStatusCodeFedEx(error.code);
      throw new AppError(error.message, statusCode);
    }
  }
};

exports.obtainFedExStatus = (code) => {
  console.log(code);
  switch (code) {
    case "OC":
      return ShipmentEvents.LabelCreated;
    case "PU":
    case "PX":
    case "AP":
      return ShipmentEvents.PickedUp;
    case "DP":
      return ShipmentEvents.Departed;
    case "CC":
    case "CD":
    case "CP":
      return ShipmentEvents.EnteredCustoms;
    case "EA":
      return ShipmentEvents.DepartedCustoms;
    case "AD":
    case "OD":
      return ShipmentEvents.LastMile;
    case "DL":
      return ShipmentEvents.Delivered;
    case "RS":
      return ShipmentEvents.ReturnedToSender;
    default:
      return ShipmentEvents.InTransit;
  }
};

/*
OC -> LabelCreated
PU, PX, AP -> PickedUp
DP -> Departed
CC, CD, CP -> EnteredCustoms
EA -> DepartedCustoms
AD, OD -> LastMile
DL -> Delivered
RS -> ReturnedToSender
*/

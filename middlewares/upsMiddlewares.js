const axios = require("axios");
const AppError = require("../utils/appError");
const { v4 } = require("uuid");
const ShipmentEvents = require("../utils/shippmentEvents");

exports.obtainNewUpsToken = async () => {
  console.log("Entered Here Ups Obtain New Token");
  const data = {
    grant_type: "client_credentials",
  };

  try {
    const response = await axios.post(process.env.UPS_URL_TOKEN, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.UPS_CLIENT_ID}:${process.env.UPS_SECRET_ID}`
          ).toString("base64"),
      },
    });

    console.log("From Token Method\n\n");
    console.log(response.data);

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
      e.response.data.response.errors[0].message,
      e.response.status
    );
  }
};

exports.trackUPSRequest = async (trackingNumber, token, language) => {
  console.log("Entered The Tracking UPS");
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

  const query = new URLSearchParams({
    locale,
  }).toString();

  console.log("Before Sending the request");
  const inquiryNumber = trackingNumber;
  try {
    const response = await axios.get(
      `${process.env.UPS_URL}${inquiryNumber}?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          transId: v4(),
          transactionSrc: "testing",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("After Sending the request");
    console.log(response.data);

    // Ups In The Production Mode Don't Send a status code indicating the error so i have to handle it the way below For Every Thing i added status code 404
    const er = response?.data?.trackResponse?.shipment[0]?.warnings;

    if (er) {
      throw er[0];
    }

    // after checking the docs (Track Info not found for all inquiry numbers)
    if (response.status === 207) {
      throw response;
    }

    return response.data;
  } catch (e) {
    if (e.response) {
      throw new AppError(
        e.response.data.response.errors[0].message,
        e.response.status
      );
    }

    throw new AppError(e.message, 404);
  }
};

// creating the mapping for UPS

exports.obtainUpsStatus = (type) => {
  switch (type) {
    case "M":
      return ShipmentEvents.LabelCreated;
    case "D":
      return ShipmentEvents.Delivered;
    case "I":
      return ShipmentEvents.LastMile;
    case "P":
      return ShipmentEvents.DepartedCustoms;
    case "X":
      return ShipmentEvents.SpecialEvent;
    case "RS":
      return ShipmentEvents.ReturnedToSender;
    default:
      // added later
      return ShipmentEvents.NotDelivered;
  }
};

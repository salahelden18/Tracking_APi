const axios = require("axios");
const AppError = require("../utils/appError");
const ShipmentEvents = require("../utils/shippmentEvents");

exports.trackDhlRequest = async (trackingNumber, language) => {
  const url = process.env.DHL_URL;

  let lang;
  if (language === undefined) {
    lang = "en";
  } else if (language === "ar" || language === "en" || language === "tr") {
    lang = language;
  } else {
    lang = "en";
  }

  try {
    const response = await axios.get(
      `${url}trackingNumber=${trackingNumber}&language=${lang}`,
      {
        headers: {
          "DHL-API-Key": process.env.DHL_CLIENT_ID,
        },
      }
    );

    return response.data;
  } catch (e) {
    throw new AppError(e.response.data.detail, e.response.status);
  }
};

exports.obtainDHLStatus = (desc) => {
  if (desc.includes("information received") || desc.includes("bilgi alındı")) {
    return ShipmentEvents.LabelCreated;
  } else if (desc.includes("departed") || desc.includes("ayrılması")) {
    return ShipmentEvents.Departed;
  } else if (
    desc.includes("courier for delivery") ||
    desc.includes("teslimat için")
  ) {
    return ShipmentEvents.LastMile;
  } else if (desc.includes("delivered") || desc.includes("teslim edildi")) {
    return ShipmentEvents.Delivered;
  } else if (desc.includes("arrived") || desc.includes("varış yaptı")) {
    return ShipmentEvents.EnteredCustoms;
  } else if (
    desc.includes("sort facility") ||
    desc.includes("sıralama tesisine")
  ) {
    return ShipmentEvents.DepartedCustoms;
  } else if (
    desc.includes("not delivered") ||
    desc.includes("teslim edilmedi")
  ) {
    return ShipmentEvents.NotDelivered;
  }

  // if (desc.includes("information received")) {
  //   return ShipmentEvents.LabelCreated;
  // } else if (desc.includes("departed")) {
  //   return ShipmentEvents.Departed;
  // } else if (desc.includes("courier for delivery")) {
  //   return ShipmentEvents.LastMile;
  // } else if (desc.includes("delivered")) {
  //   return ShipmentEvents.Delivered;
  // } else if (desc.includes("arrived")) {
  //   return ShipmentEvents.EnteredCustoms;
  // } else if (desc.includes("sort facility")) {
  //   return ShipmentEvents.DepartedCustoms;
  // }

  return ShipmentEvents.InTransit;
};

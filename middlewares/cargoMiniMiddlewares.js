const axios = require("axios");
const AppError = require("../utils/appError");

exports.trackCargoMiniRequest = async (trackingNumber) => {
  const url = process.env.CARGO_MINI_URL;

  try {
    const response = await axios.get(`${url}${trackingNumber}`);

    return response.data;
  } catch (e) {
    const errData = e.response.data;
    throw new AppError(errData.title, errData.status);
  }
};

const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required"],
    },
    expireDate: { type: Date, required: [true, "expiration date is required"] },
    carrierCompany: {
      type: String,
      required: [true, "carrier company is required"],
      enum: {
        values: ["FEDEX", "UPS", "DHL", "CARGOMINI"],
        message: "Only FedEx, Ups, CargoMini, and DHL are Allowed",
      },
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.methods.checkToken = function (token) {
  return token.expireDate.getTime() > Date.now();
};

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;

const mongoose = require("mongoose");

const packagePropSchema = new mongoose.Schema({
  height: {
    type: Number,
  },
  width: {
    type: Number,
  },
  length: {
    type: Number,
  },
  weight: {
    type: Number,
    required: [true, "weight is required"],
  },
});

const calcSchema = new mongoose.Schema(
  {
    packageType: {
      type: Number,
      required: [true, "Package Type is Required"],
      min: [1, "package type minimum value is 1"],
      max: [2, "package type maximum value is 2"],
    },
    countryCode: {
      type: String,
      minLength: [2, "country code should be at least 2 characters"],
      maxLength: [2, "country code should be at most 2 characters"],
      required: [true, "country code is required"],
    },
    packageProp: [packagePropSchema],
    tradeType: {
      type: Number,
      required: [true, "Trade Type is required"],
      enum: {
        values: [1, 2],
        message: "Please Enter 1 for export and 2 for import",
      },
    },
    carrierCompany: String,
    lowestPrice: Number,
  },
  {
    timestamps: true,
  }
);

const CargoCalc = mongoose.model("CargoCalcs", calcSchema);

module.exports = CargoCalc;

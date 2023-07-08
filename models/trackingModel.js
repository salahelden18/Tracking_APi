const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, "tracking Number is required"],
  },
  // add an enum here
  carrierCompany: {
    type: String,
    required: [true, "The Carrier Company Name is Required"],
  },
  requestsDate: {
    type: [Date],
    default: Date.now,
  },
  count: {
    type: Number,
    default: 1,
  },
  status: {
    type: Number,
    min: [1, "status cannot be less than 1"],
  },
  description: String,
});

const Tracking = mongoose.model("Tracking", trackingSchema);

module.exports = Tracking;

const express = require("express");
const trackingController = require("../controllers/trackingController");
const tokenController = require("../controllers/tokenController");

const router = express.Router();

router.post(
  "/",
  tokenController.checkBody,
  tokenController.getToken,
  trackingController.trackShipment
);

module.exports = router;

const express = require("express");
const trackingController = require("../controllers/trackingController");
const tokenController = require("../controllers/tokenController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Track
 */

/**
 * @swagger
 * /api/v1/track:
 *  post:
 *    summary: Returns the shipment events and info about the shipment
 *    tags: [Track]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              carrierCompany:
 *                type: string
 *                example: DHL
 *              trackingNumber:
 *                type: string
 *
 *    responses:
 *      200:
 *        description: Success response with the list of events and info about the shipment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                requestInfo:
 *                  type: object
 *                  properties:
 *                    carrierCompany:
 *                      type: string
 *                      example: DHL
 *                    trackingNumber:
 *                      type: string
 *                      example: "1042863415"
 *                    description:
 *                      type: string
 *                      example: Delivered
 *                events:
 *                  type: object
 *                  properties:
 *                    lastStatus:
 *                      type: string
 *                      example: Delivered
 *                    data:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          timestamp:
 *                            type: string
 *                            format: date-time
 *                            example: "2023-04-10T16:03:00"
 *                          status:
 *                            type: string
 *                            example: Delivered
 *                          description:
 *                            type: string
 *                            example: Delivered
 *      404:
 *        description: Shipment not found. Indicates that the provided tracking number does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: fail
 *                message:
 *                  type: string
 *                  example: "Shipment Not Found"
 *
 */
router.post(
  "/",
  tokenController.checkBody,
  tokenController.getToken,
  trackingController.trackShipment
);

module.exports = router;

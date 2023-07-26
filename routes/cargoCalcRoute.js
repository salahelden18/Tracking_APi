const express = require("express");
const cargoCalcController = require("../controllers/cargoCalcController");
const checkBodyMiddleware = require("../middlewares/checkBodyMiddleware");
const checkCountryCodeMiddleware = require("../middlewares/checkCountryCodeMiddleware");
const calcPriceController = require("../controllers/calcPriceController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PackageProp:
 *       type: object
 *       properties:
 *         type:
 *           type: number
 *           description: Type of the package. 1 for documents, 2 for parcel.
 *         height:
 *           type: number
 *           description: Height of the package.
 *         width:
 *           type: number
 *           description: Width of the package.
 *         length:
 *           type: number
 *           description: Length of the package.
 *         weight:
 *           type: number
 *           description: Weight of the package.
 *       required:
 *         - type
 *         - weight
 *
 *     CargoCalc:
 *       type: object
 *       properties:
 *         countryCode:
 *           type: string
 *           description: Country code.
 *           minLength: 2
 *           maxLength: 2
 *         packageProp:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PackageProp'
 *           description: Array of package properties.
 *         tradeType:
 *           type: number
 *           description: Trade type. 1 for export, 2 for import.
 *         incoterm:
 *           type: number
 *           description: Incoterm. 1 for DDP, 2 for DAP
 *         currency:
 *           type: string
 *           description: The response will be in which currency
 *       required:
 *         - countryCode
 *         - packageProp
 *         - tradeType
 *
 *     PriceInfo:
 *       type: object
 *       properties:
 *         firmName:
 *           type: string
 *           description: Name of the firm.
 *         price:
 *           type: number
 *           description: Price of the shipment.
 *         avgShipmentDay:
 *           type: number
 *           description: Average shipment days.
 */

/**
 * @swagger
 * tags:
 *   name: Cargo
 */

/**
 * @swagger
 * /api/v1/cargo:
 *   post:
 *     summary: Calculate and save cargo price.
 *     tags: [Cargo]
 *     description: Calculate and save cargo price based on the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CargoCalc'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 lowestPrice:
 *                   $ref: '#/components/schemas/PriceInfo'
 *                 lowestShipmentDays:
 *                   $ref: '#/components/schemas/PriceInfo'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PriceInfo'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

router.post(
  "/",
  checkBodyMiddleware,
  checkCountryCodeMiddleware,
  calcPriceController.getCurrencies,
  calcPriceController.calcPrice,
  cargoCalcController.saveInDB
);

/**
 * @swagger
 * /api/v1/cargo/dbinfo:
 *   get:
 *     summary: Get cargo database information.
 *     tags: [Cargo]
 *     description: Get cargo database information including filtering and pagination options.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: The maximum number of records to retrieve. Default is 10.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number of the records to retrieve. Default is 1.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The field to sort the records by. Prefix with "-" for descending order. Default is "-createdAt".
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *         description: Filter records by country code.
 *       - in: query
 *         name: tradeType
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 2
 *         description: Filter records by trade type. 1 for export, 2 for import.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 results:
 *                   type: integer
 *                   description: Total number of records matching the filters.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CargoCalc'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

router.get("/dbinfo", cargoCalcController.getDbInfo);

module.exports = router;

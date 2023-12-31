const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const currencySchedule = require("./utils/currencySchedule");

// adding swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// adding something
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KargomKolay Tracking API",
      version: "1.0.0",
      description:
        "a tracking api for tracking international shippments from DHL, FedEx, CargoMini, Ups",
    },
    servers: [
      // {
      //   url: "https://zany-teal-piranha-garb.cyclic.app",
      // },
      {
        url: "https://kargomkolay.onrender.com",
      },
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.set("trust proxy", true);

currencySchedule();

app.use(cors());

app.options("*", cors());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// translations
const path = require("path");
const { I18n } = require("i18n");

const i18n = I18n({
  locales: ["en", "tr", "ar"],
  directory: path.join(__dirname, "translation"),
  defaultLocale: "en",
});

app.use(i18n.init);

// routes import
const trackingRoute = require("./routes/trackingRoute");
const cargoCalcRoute = require("./routes/cargoCalcRoute");

// middlewares
// Security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 request per hour
  message: "Too many requests from this IP, Please try again in an hour",
});

app.use("/api", limiter); // will affect all the routes that start with /api

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

// routes middleware
app.use("/api/v1/track", trackingRoute);
app.use("/api/v1/cargoCalc", cargoCalcRoute);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

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
const trackingController = require("./routes/trackingRoute");

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
app.use("/api/v1/track", trackingController);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

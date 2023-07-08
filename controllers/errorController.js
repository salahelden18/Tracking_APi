const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFiledsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleFedexError = (err) => {
  console.log("Entered the Handle Fedex Error");
  const message = err.response.data.errors[0].message;

  return new AppError(message, err.response.status);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

//global Error Handling
module.exports = (err, req, res, next) => {
  console.log("Came Here To Error Handlin");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let errorMessage = err.message; // Extract the error message

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = errorMessage;
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFiledsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    // because there is no identification that i can use to identify that
    if (err?.response?.data?.errors?.length > 0) error = handleFedexError(err);

    sendErrorProd(error, res);
  }
};

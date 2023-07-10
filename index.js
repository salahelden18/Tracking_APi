require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });

// start listening to the requests
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

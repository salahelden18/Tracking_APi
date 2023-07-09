require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log("Cound not connect to database");
    console.log(e);
    throw new Error(`Error connecting to database: ${e.message}`);
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

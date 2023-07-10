const ShipmentEvents = require("./shippmentEvents");

exports.getTheAssociatedKeyWithTheValue = (searchValue) => {
  for (const [currentKey, value] of Object.entries(ShipmentEvents)) {
    if (value === searchValue) {
      return currentKey;
    }
  }
  return "InTransit";
};

exports.formatTheStatusIntoUserReadableString = (value) => {
  let formattedValue = value.replace(/([A-Z]+)/g, " $1").trim();
  formattedValue = formattedValue.replace(/^\w/, (c) => c.toUpperCase());

  return formattedValue;
};

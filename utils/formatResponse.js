const { obtainUpsStatus } = require("../middlewares/upsMiddlewares");
const { obtainDHLStatus } = require("../middlewares/dhlMiddlewares");
const { obtainFedExStatus } = require("../middlewares/fedexMiddlewares");

const formatDateAndTimeIntoTimestamp = require("./formatTime");
const {
  getTheAssociatedKeyWithTheValue,
  formatTheStatusIntoUserReadableString,
} = require("./helperFunctions");

function formatData(carrierCompany, data, res) {
  switch (carrierCompany) {
    case "DHL":
      return formatDHLData(data, res);
    case "FEDEX":
      return formatFedExData(data, res);
    case "UPS":
      return formatUPSData(data, res);
    case "CARGOMINI":
      return formatCargoMiniData(data, res);
    default:
      return [];
  }
}

function formatCargoMiniData(data, res) {
  const events = [...data.events].reverse();
  const lastStatus = events[0].event;

  const activities = events.map((el) => {
    const status = getTheAssociatedKeyWithTheValue(el.event);

    return {
      timestamp: el.date,
      status: res.__(status),
      description: el.description,
    };
  });

  return {
    lastStatus,
    data: activities,
  };
}

function formatDHLData(data, res) {
  const events = data.shipments[0].events;
  const lastStatus = obtainDHLStatus(events[0].description.toLowerCase());

  const activities = events.map((el) => {
    const status = getTheAssociatedKeyWithTheValue(
      obtainDHLStatus(el.description.toLowerCase())
    );

    return {
      timestamp: el.timestamp,
      status: res.__(status),
      description: el.description,
    };
  });

  return {
    lastStatus,
    data: activities,
  };
}

function formatFedExData(data, res) {
  const events = data.output.completeTrackResults[0].trackResults[0].scanEvents;

  const lastStatus = obtainFedExStatus(events[0].eventType);

  const activities = events.map((el) => {
    const status = getTheAssociatedKeyWithTheValue(
      obtainFedExStatus(el.eventType)
    );

    return {
      timestamp: el.date,
      status: res.__(status),
      description: el.eventDescription,
    };
  });

  return {
    lastStatus,
    data: activities,
  };
}

function formatUPSData(data, res) {
  const activity = data.trackResponse.shipment[0].package[0].activity;
  const lastStatus = obtainUpsStatus(activity[0].status.type);

  const activities = activity.map((el) => {
    const status = getTheAssociatedKeyWithTheValue(
      obtainUpsStatus(el.status.type)
    );

    return {
      timestamp: formatDateAndTimeIntoTimestamp(el.date, el.time),
      status: res.__(status),
      description: el.status?.description?.toLowerCase()?.trim(),
    };
  });

  return {
    lastStatus,
    data: activities,
  };
}

module.exports = formatData;

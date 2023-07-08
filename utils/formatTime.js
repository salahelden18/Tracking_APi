const moment = require("moment");

function formatDateAndTimeIntoTimestamp(date, time) {
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  const timestamp = moment(`${formattedDate}T${formattedTime}`).toISOString();

  return timestamp;
}

function formatDate(date) {
  return moment(date, "YYYYMMDD").format("YYYY-MM-DD");
}

function formatTime(time) {
  return moment(time, "HHmmss").format("HH:mm:ss");
}

module.exports = formatDateAndTimeIntoTimestamp;

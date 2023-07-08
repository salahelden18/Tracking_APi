module.exports = (code) => {
  switch (code) {
    case "CUSTOMER.REVOKE.REQUIRED":
    case "USER.RELOGIN.REQUIRED":
    case "NOT.AUTHORIZED.ERROR":
      return 401;
    case "FORBIDDEN.ERROR":
    case "CUSTOMER.USAGE.LOCKED":
      return 403;
    case "NOT.FOUND.ERROR":
    case "TRACKING.REFERENCENUMBER.NOTFOUND":
    case "TRACKING.TCN.NOTFOUND":
    case "TRACKING.TRACKINGNUMBER.NOTFOUND":
    case "NOTIFICATION.TRACKINGNBR.NOTFOUND":
    case "TRACKINGDOCUMENT.DOCUMENT.UNAVAILABLE":
      return 404;
    case "INTERNAL.SERVER.ERROR":
      return 500;
    case "SERVICE.UNAVAILABLE.ERROR":
      return 503;
    default:
      return 400;
  }
};

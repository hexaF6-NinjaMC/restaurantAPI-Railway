const { isObjectIdOrHexString } = require("mongoose");
const mongodb = require("../data/database");
const { createObjectId } = require("../helpers/utils");

/**
 * Checks to see if the session user is logged in.
 * If `False`, returns an HTTP 401 (Unauthorized) status, else proceeds to use the Express application.
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(401).json("You do not have access.");
  }
  next();
};

/**
 * Checks to see if the user account has an op_lvl of 1 or 2.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds to use the Express application.
 */
const isAdminOrManager = (req, res, next) => {
  if (req.session.user.op_lvl !== 1 && req.session.user.op_lvl !== 2) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  next();
};

/**
 * Checks if account is op_lvl of 1.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds to use the Express application.
 */
const isFirstLevel = (req, res, next) => {
  if (req.session.user.op_lvl !== 1) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  next();
};

/**
 * Checks if account has op_lvl of 1 or if account is a customer account with matching ID.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds to use the Express application.
 */
const isNotManager = (req, res, next) => {
  if (
    req.session.user.op_lvl !== 1 &&
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.user._id !== req.params.id.toLowerCase()
  ) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  next();
};

/**
 * Checks if account has op_lvl of 1 or 2 or if customer account ID matches the request.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds with the logic check.
 * Checks if parameters ID and USER_ID are valid 24-character HexString MongoDB ObjectIDs.
 * If `False`, returns an HTTP 400 (Bad Request) status, else proceeds to use the Express application.
 */
const isAdminOrMangerOrCXIDMatches = (req, res, next) => {
  if (
    req.session.user.op_lvl !== 1 &&
    req.session.user.op_lvl !== 2 &&
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.user._id !== req.query.user_id.toLowerCase()
  ) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  if (!isObjectIdOrHexString(req.query.user_id)) {
    return res
      .status(400)
      .json("ID is not a valid 24-character HexString ObjectID.");
  }
  next();
};

/**
 * Checks if account has op_lvl of 1 or 2 or if queried customer account ID matches the session `_id`.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds with the logic check.
 */
const isAdminOrMangerOrCXIDMatchesSession = async (req, res, next) => {
  const ID = createObjectId(req.params.id);
  const customerData = await mongodb
    .getDb()
    .db()
    .collection("customers")
    .findOne({ _id: ID });
  if (
    req.session.user.op_lvl !== 1 &&
    req.session.user.op_lvl !== 2 &&
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.user._id !== customerData._id.toString()
  ) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  next();
};

/**
 * Checks if account has op_lvl of 1 or 2 or if customer account ID matches the order's `user_id`.
 * If `False`, returns an HTTP 403 (Forbidden) status, else proceeds with the logic check.
 */
const isAdminOrMangerOrOrderCX = async (req, res, next) => {
  const ID = createObjectId(req.params.id);
  const orderData = await mongodb
    .getDb()
    .db()
    .collection("orders")
    .findOne({ _id: ID });
  if (
    req.session.user.op_lvl !== 1 &&
    req.session.user.op_lvl !== 2 &&
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.user._id !== orderData.user_id.toString()
  ) {
    return res
      .status(403)
      .json("You do not have permission to use that resource/method.");
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  isNotManager,
  isAdminOrMangerOrCXIDMatches,
  isAdminOrMangerOrCXIDMatchesSession,
  isAdminOrMangerOrOrderCX
};

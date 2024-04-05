/**
 * Performs req.params checks to ensure the input is within valid constraints
 */

const { isObjectIdOrHexString } = require("mongoose");

/**
 * Checks if the main input id is a valid default MongoDB ObjectId (24 char HexString).
 * If `False`, responds with an HTTP 400 (Bad Request) response and stops, otherwise continues processing.
 */
const isValidId = (req, res, next) => {
  if (!isObjectIdOrHexString(req.params.id)) {
    return res
      .status(400)
      .json(
        "Parameter/query must use a valid HexString ID of 24 characters to perform that function."
      );
  }
  next();
};

/**
 * Checks if the input (appears after `?<param>=`) is an op_lvl of either 1 or 2.
 * If `False` (Where both checks are `False`), responds with an HTTP 400 (Bad Request) response and stops, otherwise continues processing.
 */
const isValidLevel = (req, res, next) => {
  if (
    parseInt(req.query.op_lvl, 10) !== 1 &&
    parseInt(req.query.op_lvl, 10) !== 2
  ) {
    return res
      .status(400)
      .json("Must query with '1' or '2' to find that information.");
  }
  next();
};

module.exports = {
  isValidId,
  isValidLevel
};

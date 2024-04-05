/**
 * Generates the Swagger documentation for the Restaurant API
 */

const router = require("express").Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const swaggerOptions = require("../swagger-options");

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

module.exports = router;

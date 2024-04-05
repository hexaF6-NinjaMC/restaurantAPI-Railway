/**
 * Contains functionality for admin/manager operators.
 */

const { createObjectId } = require("../helpers/utils");
const mongodb = require("../data/database");
const { adminPOSTSchema, adminPUTSchema } = require("../helpers/validate");

/**
 * Retrieves results from Admin record based on the `req.params.op_lvl`.
 */
const getAll = async (req, res, next) => {
  // #swagger.tags = ["Admin"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get All Admin (lvl 1) or Manager (lvl 2) records."
  // #swagger.description = "Get All Admin (lvl 1) or Manager (lvl 2) records."
  /* #swagger.parameters["op_lvl"] = {
    description: "The Operator level to filter by.",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Admin records were successfully retrieved."}
  // #swagger.responses[204] = {description: "No Content: Nothing existed in the database for that query."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in with an Admin account."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin account with the appropriate privileges."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while retrieving the Admin profile."}
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("operators")
      .find({ op_lvl: parseInt(req.query.op_lvl, 10) });
    result.toArray().then((resArr) => {
      res.setHeader("Content-Type", "application/json");
      if (resArr.length === 0) {
        return res.status(204).send(); // Nothing to send back, as nothing exists.
      }
      res.status(200).json(resArr);
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves results from Admin record by ID.
 */
const getAdminById = async (req, res, next) => {
  // #swagger.tags = ["Admin"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get Admin (lvl 1) or Manager (lvl 2) record by ID."
  // #swagger.description = "Get Admin (lvl 1) or Manager (lvl 2) record by ID."
  /* #swagger.parameters["id"] = {
    description: "Operator\'s ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Admin record was successfully retrieved."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in with an Admin account."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin account with the appropriate privileges."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while retrieving the Admin profile."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("operators")
      .findOne({ _id: ID });
    res.setHeader("Content-Type", "application/json");
    if (!result) {
      return res.status(404).json({
        message: `Nothing could be found with ID ${ID}.`
      }); // Nothing was found.
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Attempts to create a new admin (op_lvl 1) or manager (op_lvl 2) account,
 * or returns errors if they are encountered.
 */
const createAdmin = async (req, res, next) => {
  // #swagger.tags = ["Admin"]
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaAdminRequired"
        }
      }
    }
  } */
  /* #swagger.security = [{
    "Admin": [
      "write"
    ]
  }] */
  // #swagger.summary = "Create a new Admin (lvl 1) or Manager (lvl 2) record."
  // #swagger.description = "Create a new Admin (lvl 1) or Manager (lvl 2) record."
  // #swagger.responses[201] = {description: "Created: Admin record was successfully created."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in with an Admin account."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin account with the appropriate privileges."}
  // #swagger.responses[409] = {description: "Conflict: Email is already in use for this collection."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Admin profile."}
  try {
    const operatorBody = {
      displayName: req.body.displayName,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profilePicURI: req.body.profilePicURI,
      op_lvl: req.body.op_lvl,
      isAdmin: true,
      creationDate: new Date().toLocaleDateString()
    };
    const operatorData = await adminPOSTSchema.validateAsync(operatorBody, {
      allowUnknown: true
    });
    let operator = await mongodb
      .getDb()
      .db()
      .collection("operators")
      .findOne({ email: operatorData.email });
    res.setHeader("Content-Type", "application/json");
    if (!operator) {
      operator = await mongodb
        .getDb()
        .db()
        .collection("operators")
        .insertOne(operatorData);
      res.status(201).json(operator);
      return;
    }
    res.status(409).json({
      message:
        "Unique Error: \"Email\" field in `req.body` is a duplicate of another resource."
    });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Attempts to update a record with `req.body` fields
 */
const updateAdmin = async (req, res, next) => {
  // #swagger.tags = ["Admin"]
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaAdminOptional"
        }
      }
    }
  } */
  /* #swagger.security = [{
    "Admin": [
      "write"
    ]
  }] */
  // #swagger.summary = "Update Admin/Manager record, ref'd by _id, with optional fields."
  // #swagger.description = "Update Admin/Manager record, ref'd by _id, with optional fields."
  /* #swagger.parameters["id"] = {
    description: "Operator\'s ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Admin record was successfully updated."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in with an Admin account."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin account with the appropriate privileges."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[409] = {description: "Conflict: Unique Constraint Error: Email is already in use for this collection."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Admin profile."}
  try {
    const ID = createObjectId(req.params.id);
    const operatorBody = {
      displayName: req.body.displayName,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profilePicURI: req.body.profilePicURI,
      op_lvl: req.body.op_lvl,
      isAdmin: true,
      creationDate: new Date().toLocaleDateString()
    };
    const operatorData = await adminPUTSchema.validateAsync(operatorBody, {
      allowUnknown: true
    });
    let operator = await mongodb
      .getDb()
      .db()
      .collection("operators")
      .findOne({ email: operatorData.email });
    res.setHeader("Content-Type", "application/json");
    if (!operator) {
      // operator email not found, good to proceed
      operator = await mongodb
        .getDb()
        .db()
        .collection("operators")
        .findOneAndUpdate(
          { _id: ID },
          {
            $set: operatorData
          },
          { returnDocument: "after" } // Use this setup for updating fields within record.
        );
      if (!operator) {
        // ID not found, resource not found (404)
        return res
          .status(404)
          .json({ message: `Nothing to update by ID ${ID}.` }); // Use 404 if nothing found/updated in collection
      }
      return res.status(200).json(operator);
    }
    res.status(409).json({
      message:
        "Unique Error: \"Email\" field in `req.body` is a duplicate of another resource."
    });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Attempts to delete an Admin record by ID.
 */
const deleteAdmin = async (req, res, next) => {
  // #swagger.tags = ["Admin"]
  /* #swagger.security = [{
    "Admin": [
      "delete"
    ]
  }] */
  // #swagger.summary = "Delete Admin/Manager record, ref'd by _id."
  // #swagger.description = "Delete Admin/Manager record, ref'd by _id."
  /* #swagger.parameters["id"] = {
    description: "Operator\'s ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Admin record was successfully deleted."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin account with the appropriate privileges."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Admin profile."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("operators")
      .deleteOne({ _id: ID });
    res.setHeader("Content-Type", "application/json");
    if (result.deletedCount === 0) {
      res.status(404).json({ message: `Nothing to delete by ID ${ID}.` }); // Falsy (default) // Should we use 200 or 404 if nothing found in collection for deleteAdmin()?
      return;
    }
    res.status(200).json({ message: "Successfully deleted admin record." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById
};

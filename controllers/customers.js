/**
 * Started implementing functionality for customers.
 * Contains functionality for creating, reading, updating, and deleting customers according to the Joi schema.
 */

const mongodb = require("../data/database");
const { createObjectId } = require("../helpers/utils");
const {
  customerPOSTSchema,
  customerPUTSchema
} = require("../helpers/validate");

/**
 * Retrieves results from Customer records, while session user has an Admin `op_lvl` of 1 or Manager `op_lvl` of 2.
 */
const getAll = async (req, res, next) => {
  // #swagger.tags = ["Customer"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get All Customer records."
  // #swagger.description = "Get All Customer records."
  // #swagger.responses[200] = {description: "OK: Customer record was successfully created."}
  // #swagger.responses[204] = {description: "No Content: Nothing existed in the database for that query."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin/Manager account with the appropriate privileges."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Customer profile."}
  try {
    const result = await mongodb.getDb().db().collection("customers").find();
    result.toArray().then((resArr) => {
      res.setHeader("Content-Type", "application/json");
      if (resArr.length === 0) {
        res.status(204).send(); // Nothing to send back, as nothing exists.
        return;
      }
      res.status(200).json(resArr);
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Customer record by ID if authenticated.
 */
const getCustomerById = async (req, res, next) => {
  // #swagger.tags = ["Customer"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ],
    "Customer": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get Customer record by ID."
  // #swagger.description = "Get Customer record by ID."
  /* #swagger.parameters["id"] = {
    description: "Customer ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Customer record was successfully retrieved."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Customer profile."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("customers")
      .findOne({ _id: ID });
    res.setHeader("Content-Type", "application/json");
    if (!result) {
      res
        .status(404)
        .json({ message: `Customer not found by ID ${req.params.id}.` });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Customer, provided the session user is not logged in as a Manager (`op_lvl` 2).
 */
const createCustomer = async (req, res, next) => {
  // #swagger.tags = ["Customer"]
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaCustomerRequired"
        }
      }
    }
  } */
  /* #swagger.security = [{
    "Admin": [
      "write"
    ],
    "Customer": [
      "write"
    ]
  }] */
  // #swagger.summary = "Create a new Customer record."
  // #swagger.description = "Create a new Customer record."
  // #swagger.responses[200] = {description: "OK: Customer record was successfully created."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You do not have access to that account information."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[409] = {description: "Conflict: Unique Constraint Error: Email is already in use for this collection."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Customer profile."}
  try {
    const customerBody = {
      displayName: req.body.displayName,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profilePicURI: req.body.profilePicURI,
      creationDate: new Date().toLocaleDateString()
    };
    const customerData = await customerPOSTSchema.validateAsync(customerBody, {
      allowUnknown: true
    });
    let customer = await mongodb
      .getDb()
      .db()
      .collection("customers")
      .findOne({ email: customerData.email });
    res.setHeader("Content-Type", "application/json");
    if (!customer) {
      customer = await mongodb
        .getDb()
        .db()
        .collection("customers")
        .insertOne(customerData);
      res.status(201).json(customer);
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
 * Update Customer record, provided the session user is logged in as an Admin (`op_lvl` 1) OR their ID equals the parameter ID.
 */
const updateCustomer = async (req, res, next) => {
  // #swagger.tags = ["Customer"]
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaCustomerOptional"
        }
      }
    }
  } */
  /* #swagger.security = [{
    "Admin": [
      "write"
    ],
    "Customer": [
      "write"
    ]
  }] */
  // #swagger.summary = "Update Customer record, ref'd by _id, with optional fields."
  // #swagger.description = "Update Customer record, ref'd by _id, with optional fields."
  /* #swagger.parameters["id"] = {
    description: "Customer ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Customer record was successfully updated."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Customer profile."}
  try {
    const ID = createObjectId(req.params.id);
    const customerBody = {
      displayName: req.body.displayName,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profilePicURI: req.body.profilePicURI,
      creationDate: new Date().toLocaleDateString()
    };
    const customerData = await customerPUTSchema.validateAsync(customerBody, {
      allowUnknown: true
    });
    let customer = await mongodb
      .getDb()
      .db()
      .collection("customers")
      .findOne({ email: customerData.email });
    res.setHeader("Content-Type", "application/json");
    if (!customer) {
      // customer email not found, good to proceed
      customer = await mongodb
        .getDb()
        .db()
        .collection("customers")
        .findOneAndUpdate(
          { _id: ID },
          {
            $set: customerData
          },
          {
            returnDocument: "after"
          }
        );
      if (!customer) {
        res
          .status(404)
          .json({ message: `Nothing to update by ID ${req.params.id}.` }); // Use 404 if nothing found/updated in collection
        return;
      }
      res.status(200).json(customer);
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

const deleteCustomer = async (req, res, next) => {
  // #swagger.tags = ["Customer"]
  /* #swagger.security = [{
    "Admin": [
      "delete"
    ],
    "Customer": [
      "delete"
    ]
  }] */
  // #swagger.summary = "Delete Customer record, ref'd by _id."
  // #swagger.description = "Delete Customer record, ref'd by _id."
  /* #swagger.parameters["id"] = {
    description: "Customer ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Customer record was successfully deleted."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while deleting the Customer profile."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("customers")
      .deleteOne({ _id: ID });
    res.setHeader("Content-Type", "application/json");
    if (result.deletedCount === 0) {
      res
        .status(404)
        .json({ message: `Nothing to delete by ID ${req.params.id}.` }); // Use 200 or 404 if nothing found in collection for deleteCustomer()
      return;
    }
    res.status(200).json({ message: "Successfully deleted customer record." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

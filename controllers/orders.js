const mongodb = require("../data/database");
const { createObjectId } = require("../helpers/utils");
const { orderPOSTSchema, orderPUTSchema } = require("../helpers/validate");

/**
 * Restricted to Admin (op_lvl 1) and Manager (op_lvl 2) accounts.
 */
const getAll = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get All Order records."
  // #swagger.description = "Get All Order records."
  // #swagger.responses[200] = {description: "OK: Order records were successfully pulled."}
  // #swagger.responses[204] = {description: "No Content: No records found in collection."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin or Manager account with the appropriate privileges."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while pulling the Order record."}
  try {
    const result = await mongodb.getDb().db().collection("orders").find();
    result.toArray().then((resArr) => {
      if (resArr.length === 0) {
        res.setHeader("Content-Type", "application/json");
        res.status(204).json({ message: "No orders to display." }); // Use 204 if nothing found in collection for getAll().
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(resArr);
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the Order record by ID.
 */
const getOrderById = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ],
    "Customer": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get Order record by ID."
  /* #swagger.parameters["id"] = {
    description: "Order ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Order record was successfully retrieved."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in as an Admin or Manager with the appropriate privileges, or with the appropriate Customer account."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while obtaining the Order record."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("orders")
      .findOne({ _id: ID });
    if (!result) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ message: `No order found with ID ${ID}.` }); // Use 404 if nothing found in collection.
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets all the Order records by User ID, provided authentication checks pass.
 */
const getAllOrdersByUserId = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "read"
    ],
    "Customer": [
      "read"
    ]
  }] */
  // #swagger.summary = "Get Order records by Customer ID."
  /* #swagger.parameters["user_id"] = {
    description: "The Orders\' User ID; a hexadecimal string of 24 characters. If not Admin (op_lvl 1) or Manager (op_lvl 2), must match the session user ID.",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Order record was successfully retrieved."}
  // #swagger.responses[204] = {description: "No Content: No records found in collection."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character MongoDB ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in as an Admin or Manager with the appropriate privileges, or with the appropriate Customer account."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while obtaining the Order record."}
  try {
    const ID = createObjectId(req.query.user_id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("orders")
      .find({ user_id: ID });
    result.toArray().then((resArr) => {
      if (resArr.length === 0) {
        res.setHeader("Content-Type", "application/json");
        res.status(204).json({ message: "No orders to display." }); // Use 204 if nothing found in collection for getAll().
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(resArr);
    });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "write"
    ],
    "Customer": [
      "write"
    ]
  }] */
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaOrderRequired"
        }
      }
    }
  } */
  // #swagger.summary = "Create Order record."
  // #swagger.description = "Create Order record."
  /* #swagger.parameters["user_id"] = {
    description: "The Order\'s User ID; a hexadecimal string of 24 characters. If not Admin (op_lvl 1) or Manager (op_lvl 2), must match the session user ID.",
    required: true
  } */
  // #swagger.responses[201] = {description: "Created: Order record was successfully created."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in as an Admin or Manager with the appropriate privileges, or with the appropriate Customer account."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Order record."}
  try {
    const USER_ID = createObjectId(req.query.user_id);
    const orderBody = {
      user_id: USER_ID,
      itemName: req.body.itemName,
      amount: req.body.amount
    };
    const orderData = await orderPOSTSchema.validateAsync(orderBody, {
      allowUnknown: true
    });
    // Create a new order with CX ID
    const order = await mongodb
      .getDb()
      .db()
      .collection("orders")
      .insertOne(
        // Now for the hard stuff
        {
          user_id: orderData.user_id,
          requests: {
            itemName: orderData.itemName,
            amount: orderData.amount
          }
        }
      );
    res.status(201).json(order);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Update Order by ID if logged in as Admin, Manager, or the User with ID matching Order's `user_id`.
 */
const updateOrder = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "write"
    ],
    "Customer": [
      "write"
    ]
  }] */
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaOrderOptional"
        }
      }
    }
  } */
  // #swagger.summary = "Update Order record, with optional fields."
  // #swagger.description = "Update Order record, with optional fields."
  /* #swagger.parameters["id"] = {
    description: "Order ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Order record was successfully updated."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character MongoDB ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in as an Admin or Manager with the appropriate privileges, or with the appropriate Customer account."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while obtaining the Order record."}
  try {
    const ID = createObjectId(req.params.id);
    const orderBody = {
      itemName: req.body.itemName,
      amount: req.body.amount
    };
    const orderData = await orderPUTSchema.validateAsync(orderBody, {
      allowUnknown: true
    });
    const result = await mongodb
      .getDb()
      .db()
      .collection("orders")
      .findOneAndUpdate(
        // Now for the hard stuff
        { _id: ID },
        {
          $set: {
            "requests.itemName": orderData.itemName,
            "requests.amount": orderData.amount
          }
        },
        {
          returnDocument: "after"
        }
      );
    if (!result) {
      return res
        .status(404)
        .json({ message: `Nothing to update by ID ${ID}.` }); // Use 404 if nothing found/updated in collection
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Delete an order item, using "requests.item" in collection.
 */
const deleteOrder = async (req, res, next) => {
  // #swagger.tags = ["Orders"]
  /* #swagger.security = [{
    "Admin": [
      "delete"
    ],
    "Customer": [
      "delete"
    ]
  }] */
  // #swagger.summary = "Delete Order record by ID."
  // #swagger.description = "Delete Order record by ID."
  /* #swagger.parameters["id"] = {
    description: "Order ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Order record was successfully retrieved."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character MongoDB ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in as an Admin or Manager with the appropriate privileges, or with the appropriate Customer account."}
  // #swagger.responses[404] = {description: "Not Found: No record found with ID provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while obtaining the Order record."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("orders")
      .deleteOne({ _id: ID });
    res.setHeader("Content-Type", "application/json");
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `Nothing to delete by ID ${ID}.` }); // Use 404 if nothing found in collection for deleteOrder()
    }
    res.status(200).json({ message: "Successfully deleted order record." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOrderById,
  getAllOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder
};

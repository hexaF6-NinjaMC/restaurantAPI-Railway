const { createObjectId } = require("../helpers/utils");
const mongodb = require("../data/database");
const {
  inventoryPOSTSchema,
  inventoryPUTSchema
} = require("../helpers/validate");

/**
 * Retrieves all Inventory item records.
 */
const getAll = async (req, res, next) => {
  // #swagger.tags = ["Inventory"]
  // #swagger.summary = "Get All Inventory records."
  // #swagger.description = "Get All Inventory records."
  // #swagger.responses[200] = {description: "OK: Inventory records were successfully pulled."}
  // #swagger.responses[204] = {description: "No Content: Nothing existed in the database for that query."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while pulling the Inventory record."}
  try {
    const result = await mongodb.getDb().db().collection("inventory").find();
    result.toArray().then((resArr) => {
      res.setHeader("Content-Type", "application/json");
      if (resArr.length === 0) {
        res.status(204).json({ message: "No inventory to display." }); // Use 204 if nothing found in collection for getAll().
        return;
      }
      res.status(200).json(resArr);
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves an inventory item record by ID.
 */
const getItemById = async (req, res, next) => {
  // #swagger.tags = ["Inventory"]
  // #swagger.summary = "Get inventory items by Object ID."
  // #swagger.description = "Get inventory items by Object ID."
  /* #swagger.parameters["id"] = {
    description: "Inventory item ID",
    required: true
  } */
  // #swagger.responses[201] = {description: "Created: Inventory item was successfully received."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[404] = {description: "Not Found: No inventory item found with id provided."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while requesting the Inventory item."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("inventory")
      .findOne({ _id: ID });
    result.setHeader("Content-Type", "application/json");
    if (!result) {
      res.status(404).json(`No inventory item found with id ${ID}`);
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new Inventory item record
 */
const createItem = async (req, res, next) => {
  // #swagger.tags = ["Inventory"]
  /* #swagger.security = [{
    "Admin": [
      "write"
    ]
  }] */
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaInventoryRequired"
        }
      }
    }
  } */
  // #swagger.summary = "Create a new Inventory record."
  // #swagger.description = "Create a new Inventory record."
  // #swagger.responses[201] = {description: "Created: Inventory record was successfully created."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin/Manager account."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while creating the Inventory record."}
  try {
    const invBody = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock
    };
    const invData = await inventoryPOSTSchema.validateAsync(invBody, {
      allowUnknown: true
    });
    const result = await mongodb
      .getDb()
      .db()
      .collection("inventory")
      .insertOne(invData);
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(result);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Attempts to update an Inventory item record by ID.
 */
const updateItem = async (req, res, next) => {
  // #swagger.tags = ["Inventory"]
  /* #swagger.security = [{
    "Admin": [
      "write"
    ]
  }] */
  /* #swagger.requestBody = {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/schemaInventoryOptional"
        }
      }
    }
  } */
  // #swagger.summary = "Update an Inventory item record."
  // #swagger.description = "Update an Inventory item record."
  /* #swagger.parameters["id"] = {
    description: "Inventory item ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Inventory item record was successfully updated."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin/Manager account."}
  // #swagger.responses[422] = {description: "Unprocessable Entity: Data is not valid."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while updating the Inventory record."}
  try {
    const ID = createObjectId(req.params.id);

    const invBody = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock
    };

    const invData = await inventoryPUTSchema.validateAsync(invBody, {
      allowUnknown: true
    });
    const result = await mongodb
      .getDb()
      .db()
      .collection("inventory")
      .findOneAndUpdate(
        { _id: ID },
        {
          $set: invData
        },
        { returnDocument: "after" } // Use this setup for updating fields within record.
      );
    res.setHeader("Content-Type", "application/json");
    if (!result) {
      res
        .status(404)
        .json({ message: `Nothing to update by ID ${req.params.id}.` }); // Use 404 if nothing found/updated in collection
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

/**
 * Attemps to delete an Inventory item record by ID.
 */
const deleteItem = async (req, res, next) => {
  // #swagger.tags = ["Inventory"]
  /* #swagger.security = [{
    "Admin": [
      "delete"
    ]
  }] */
  // #swagger.summary = "Delete an Inventory record."
  // #swagger.description = "Delete an Inventory record."
  /* #swagger.parameters["id"] = {
    description: "Inventory item ID",
    required: true
  } */
  // #swagger.responses[200] = {description: "OK: Inventory record was successfully deleted."}
  // #swagger.responses[400] = {description: "Bad Request: ID is not a valid 24-character HexString ObjectID."}
  // #swagger.responses[401] = {description: "Unauthorized: You must be logged in with an Admin/Manager account."}
  // #swagger.responses[403] = {description: "Forbidden: You must be logged in with an Admin/Manager account with the appropriate privileges."}
  // #swagger.responses[500] = {description: "Internal Server Error: Something happened on the server side while deleting the Inventory record."}
  try {
    const ID = createObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("inventory")
      .deleteOne({ _id: ID });
    result.toArray().then((resArr) => {
      res.setHeader("Content-Type", "application/json");
      if (resArr.length === 0) {
        res
          .status(404)
          .json({ message: `Nothing to delete by ID ${req.params.id}.` }); // Falsy (default) // Use 404 if nothing found in collection for deleteItem()
        return;
      }
      res.status(200).json({ message: "Deleted record successfully." });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

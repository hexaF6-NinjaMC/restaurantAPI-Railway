/**
 * Contains the <root>/inventory/ endpoints/requests.
 */

const router = require("express").Router();

const invController = require("../controllers/inv");
const { isValidId } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdminOrManager
} = require("../middleware/authenticate");

// Get all inventory records
router.get("/", invController.getAll);

// Get inventory item record by ID
router.get("/:id", isValidId, invController.getItemById);

// Create new inventory item record if admin (op_lvl 1) or manager (op_lvl 2)
router.post("/", isAuthenticated, isAdminOrManager, invController.createItem);

// Update inventory item record by ID if admin (op_lvl 1) or manager (op_lvl 2)
router.put(
  "/:id",
  isAuthenticated,
  isAdminOrManager,
  isValidId,
  invController.updateItem
);

// Delete inventory item record by ID if admin (op_lvl 1) or manager (op_lvl 2)
router.delete(
  "/:id",
  isAuthenticated,
  isAdminOrManager,
  isValidId,
  invController.deleteItem
);

module.exports = router;

/**
 * Contains the <root>/user/ endpoints/requests.
 */

const router = require("express").Router();
const usersController = require("../controllers/customers");
const {
  isAuthenticated,
  isAdminOrManager,
  isNotManager,
  isAdminOrMangerOrCXIDMatchesSession
} = require("../middleware/authenticate");
const { isValidId } = require("../middleware/validation");

// Get all users if authenticated as Admin (op_lvl 1) or Manager (op_lvl 2).
router.get("/", isAuthenticated, isAdminOrManager, usersController.getAll);

// Get user by id if authenticated
router.get(
  "/:id",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatchesSession,
  isValidId,
  usersController.getCustomerById
);

// Create a new user if authenticated and not Manager (op_lvl 2)
router.post("/", isAuthenticated, isNotManager, usersController.createCustomer);

// Update user if authenticated as either Admin (op_lvl 2) or matching _id.
router.put(
  "/:id",
  isAuthenticated,
  isNotManager,
  isValidId,
  usersController.updateCustomer
);

// Delete user by ID if authenticated and not op_lvl 2
router.delete(
  "/:id",
  isAuthenticated,
  isNotManager,
  isValidId,
  usersController.deleteCustomer
);

module.exports = router;

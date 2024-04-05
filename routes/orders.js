/**
 * Contains the <root>/order/ endpoints/requests.
 */

const router = require("express").Router();

const ordersController = require("../controllers/orders");
const {
  isAuthenticated,
  isAdminOrManager,
  isAdminOrMangerOrCXIDMatches
} = require("../middleware/authenticate");
const { isValidId } = require("../middleware/validation");

// Gets All Orders, only admins (op_lvl 1) and managers (op_lvl 2) should be able to see.
router.get("/", isAuthenticated, isAdminOrManager, ordersController.getAll);

// Get all Order records placed by a user with User ID
router.get(
  "/customer",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatches,
  ordersController.getAllOrdersByUserId
);

// Get Order record by ID
router.get(
  "/:id",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatches,
  isValidId,
  ordersController.getOrderById
);

// Place a new order
router.post(
  "/",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatches,
  isValidId,
  ordersController.createOrder
);

// Updates an order based on order ID
router.put(
  "/:id",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatches,
  isValidId,
  ordersController.updateOrder
);

// Delete order ID for admin and user who placed order
router.delete(
  "/:id",
  isAuthenticated,
  isAdminOrMangerOrCXIDMatches,
  isValidId,
  ordersController.deleteOrder
);

module.exports = router;

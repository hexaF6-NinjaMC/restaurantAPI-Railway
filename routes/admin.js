/**
 * Contains the <root>/admin/ endpoints/requests with appropriate validations.
 */

const router = require("express").Router();
const adminController = require("../controllers/admin");
const { isValidId, isValidLevel } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel
} = require("../middleware/authenticate");

// Get all of the admins/managers on the account, only (op_lvl 1) should be able to see.
router.get(
  "/",
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  isValidLevel,
  adminController.getAll
);

// Get the admin/manager account by ID, only (op_lvl 1) should be able to see.
router.get(
  "/:id",
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  isValidId,
  adminController.getAdminById
);

// Create new admin/manager in record
router.post(
  "/",
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  adminController.createAdmin
);

// Update to admin/manager by ID
router.put(
  "/:id",
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  isValidId,
  adminController.updateAdmin
);

// Delete admin/manager by ID
router.delete(
  "/:id",
  isAuthenticated,
  isAdminOrManager,
  isFirstLevel,
  isValidId,
  adminController.deleteAdmin
);

// gotta implement valid and auth
// validation needs rules for Post and Put, and isValidId for get/put/delete with ID

module.exports = router;

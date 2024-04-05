/**
 * Contains authentication routes for '/user' and '/admin',
 * <root>/auth/user/*
 * <root>/auth/admin/*
 */

const passport = require("passport");
const router = require("express").Router();

/* ================================================================= */

/**
 * Admin auth routes
 */

router.get(
  // #swagger.ignore = true
  "/admin/login",
  passport.authenticate("admin", { scope: ["profile", "email"] })
);

router.get(
  // #swagger.ignore = true
  "/admin/logout",
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
);

// Admin - Success
router.get(
  // #swagger.ignore = true
  "/admin/success",
  (req, res) => {
    res.sendFile("success.html", { root: "./frontend" });
  }
);

/* ================================================================= */

/**
 * Customer auth routes
 */

router.get(
  // #swagger.ignore = true
  "/customer/login",
  passport.authenticate("customer", { scope: ["profile", "email"] })
);

router.get(
  // #swagger.ignore = true
  "/customer/logout",
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
);

// User - Success
router.get(
  // #swagger.ignore = true
  "/customer/success",
  (req, res) => {
    res.sendFile("success.html", { root: "./frontend" });
  }
);

module.exports = router;

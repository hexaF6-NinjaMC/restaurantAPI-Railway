/**
 * Let's serve the Restaurant API on Railway!
 */

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const passport = require("passport");
const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 8080;
const { adminPOSTSchema, customerPOSTSchema } = require("./helpers/validate");

app
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes"))
  .use(express.static("./frontend", { root: __dirname }));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  // #swagger.ignore = true
  "/",
  (req, res) => {
    res.send(
      req.session.user !== undefined
        ? "<p>Logged in.</p>"
        : "<p>Logged out.</p>"
    );
  }
);

app.get(
  // #swagger.ignore = true
  "/auth/admin/google/callback",
  passport.authenticate("admin", { scope: ["profile", "email"] }),

  async (req, res, next) => {
    try {
      let operator = await mongodb
        .getDb()
        .db()
        .collection("operators")
        .findOne({ email: req.user.email });
      if (!operator) {
        const operatorBody = {
          displayName: req.user.displayName,
          fname: req.user.given_name,
          lname: req.user.family_name,
          email: req.user.email,
          profilePicURI: req.user.photos[0].value,
          op_lvl: 2,
          isAdmin: true,
          creationDate: new Date().toLocaleDateString()
        };
        const operatorData = await adminPOSTSchema.validateAsync(operatorBody, {
          allowUnknown: true
        });
        operator = await mongodb
          .getDb()
          .db()
          .collection("operators")
          .insertOne(operatorData);
      }
      req.session.user = operator;
      res.redirect("/auth/admin/success");
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  }
);

app.get(
  // #swagger.ignore = true
  "/auth/customer/google/callback",
  passport.authenticate("customer", { scope: ["profile", "email"] }),

  async (req, res, next) => {
    try {
      let customer = await mongodb
        .getDb()
        .db()
        .collection("customers")
        .findOne({ email: req.user.email });
      if (!customer) {
        const customerBody = {
          displayName: req.user.displayName,
          fname: req.user.given_name,
          lname: req.user.family_name,
          email: req.user.email,
          profilePicURI: req.user.photos[0].value,
          creationDate: new Date().toLocaleDateString()
        };
        const customerData = await customerPOSTSchema.validateAsync(
          customerBody,
          {
            allowUnknown: true
          }
        );
        customer = await mongodb
          .getDb()
          .db()
          .collection("customers")
          .insertOne(customerData);
      }
      req.session.user = customer;
      res.redirect("/auth/customer/success");
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  }
);

/**
 * Error handler
 */
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

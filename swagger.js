// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const dotenv = require("dotenv");

dotenv.config();
const serverURL = process.env.HOST_URL;

const doc = {
  info: {
    version: "1.0.0",
    title: "Restaurant API",
    description:
      "Restaurants, orders, inventory, customers, and operator management"
  },
  servers: [
    {
      url: `${serverURL}`,
      description: "Testing server"
    }
  ],
  components: {
    securitySchemes: {
      Admin: {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: "/auth/admin/google/callback",
            scopes: {
              read: "Grants GET requests",
              write: "Grants POST and PUT requests",
              delete: "Grants DELETE requests"
            }
          }
        }
      },
      Customer: {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: "/auth/customer/google/callback",
            scopes: {
              read: "Grants GET requests",
              write: "Grants POST and PUT requests",
              delete: "Grants DELETE requests"
            }
          }
        }
      }
    },
    schemas: {
      schemaAdminRequired: {
        $displayName: "",
        $fname: "",
        lname: "",
        $email: "",
        $op_lvl: "",
        profilePicURI: ""
      },
      schemaAdminOptional: {
        displayName: "",
        fname: "",
        lname: "",
        email: "",
        op_lvl: "",
        profilePicURI: ""
      },
      schemaCustomerRequired: {
        $displayName: "",
        $fname: "",
        lname: "",
        $email: "",
        profilePicURI: ""
      },
      schemaCustomerOptional: {
        displayName: "",
        fname: "",
        lname: "",
        email: "",
        profilePicURI: ""
      },
      schemaOrderRequired: {
        $itemName: "",
        $amount: ""
      },
      schemaOrderOptional: {
        user: "",
        itemName: "",
        amount: ""
      },
      schemaInventoryRequired: {
        $productName: "",
        $price: "",
        $stock: "",
        $description: ""
      },
      schemaInventoryOptional: {
        productName: "",
        price: "",
        stock: "",
        description: ""
      }
    }
  }
};

const outputFile = "./swagger.json";
const routes = ["./routes/index.js"];

swaggerAutogen(outputFile, routes, doc);

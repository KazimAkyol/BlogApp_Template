"use strict";
/* -------------------------------------------------------
    EXPRESSJS - EJS-BLOG Project with Mongoose
------------------------------------------------------- */

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

const session = require("cookie-session");
app.use(
  session({ secret: process.env.SECRET_KEY || "secret_keys_for_cookies" }),
);
/* ------------------------------------------------------- */
// Accept json data & convert to object:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with Mongoose:
require("./src/dbConnection");

// Searching&Sorting&Pagination:
app.use(require("./src/middlewares/queryHandler"));

// StaticFiles:
app.use("/assets", express.static("./public/assets"));

// HomePage:
app.all("/", (req, res) => {
  res.redirect("/blog/post");
  // res.send('<h1>Welcome to Blog APP</h1>')
});

// Routes: // VIEWS:
app.use("/blog", require("./src/routes/view"));

// Routes: // API:
app.use("/api/blog", require("./src/routes/api"));

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));

//require('./src/helpers/sync')()
//require("./src/helpers/sync2")();

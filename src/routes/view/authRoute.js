"use strict";

const router = require("express").Router();

const user = require("../../controllers/view/userController");

router.route("/login").all(user.login);

router.get("/logout", user.logout);

router.route("register").all(user.register);

module.exports = router;

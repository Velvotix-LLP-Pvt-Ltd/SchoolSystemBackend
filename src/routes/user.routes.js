const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/user.controller");

module.exports = router;

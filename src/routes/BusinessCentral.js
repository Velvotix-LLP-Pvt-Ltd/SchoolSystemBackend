const express = require("express");
const { getOAuthToken } = require("../controllers/GetToken");

const router = express.Router();

router.post("/token", getOAuthToken);

module.exports = router;

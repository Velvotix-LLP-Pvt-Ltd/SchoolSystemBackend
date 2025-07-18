const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  refreshToken,
  check,
} = require("../controllers/AuthController");
const { protect } = require("../middlewares/AuthMiddlerware");

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/checktoken", check);

module.exports = router;

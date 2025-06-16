const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getOneUser,
  createUser,
  deleteAllUsers,
  deleteOneUser,
  modifyUser,
} = require("../controllers/user.controller");

const { validateUser } = require("../middlewares/user.middleware");
const validate = require("../middlewares/validate.middleware");

// Create a new user
router.post("/", validateUser, validate, createUser);

// Get all users
router.get("/", getAllUsers);

// Get a single user by ID
router.get("/:id", getOneUser);

// Update a user by ID
router.put("/:id", validateUser, validate, modifyUser);

// Delete a user by ID
router.delete("/:id", deleteOneUser);

// Delete all users
router.delete("/", deleteAllUsers);

module.exports = router;

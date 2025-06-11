//still working on this file ...

const User = require("../models/user.model");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a single user by ID
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, name, phone, profilePic, role } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username already exists" });

    const user = new User({
      username,
      password, // hashed 
      name,
      phone,
      profilePic,
      role,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: "User created successfully",
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete one user by ID
exports.deleteOneUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Modify (update) user by ID
exports.modifyUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // Data already validated and password hashed by middleware
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};
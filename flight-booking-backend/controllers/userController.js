const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { name, email, phone, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine created_by and modified_by
    let createdBy, modifiedBy;

    if (req.user) {
      // If the request is made by a logged-in user (e.g., an admin), use their user_id
      createdBy = req.user.user_id;
      modifiedBy = req.user.user_id;
    } else {
      // If it's a self-registration, set created_by and modified_by to null initially
      createdBy = 1;
      modifiedBy = 1;
    }

    // Create the user
    const newUser = await User.create({
      name,
      email,
      phone,
      password_hash: hashedPassword,
      role,
      created_by: createdBy,
      modified_by: modifiedBy,
    });

    // For self-registration, update created_by and modified_by to the new user's ID
    if (!req.user) {
      await newUser.update({
        created_by: newUser.user_id,
        modified_by: newUser.user_id,
      });
    }

    console.log("User Created Successfully:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Include the user's role in the JWT token payload
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    console.log("Admin Role Detected:", req.user.role);
    const users = await User.findAll();
    console.log("Users Fetched from DB:", users); // Debug log

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, modified_by } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ name, email, phone, modified_by, modified_at: new Date() });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

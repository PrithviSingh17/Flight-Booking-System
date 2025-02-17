const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
  try {
      console.log("Request Body:", req.body); 

      const { name, email, phone, password, role, created_by, modified_by } = req.body;

      if (!name || !email || !phone || !password || !role || !created_by || !modified_by) {
          return res.status(400).json({ error: "All fields except timestamps are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("Hashed Password:", hashedPassword); 

      const newUser = await User.create({
          name,
          email,
          phone,
          password_hash: hashedPassword,
          role,
          created_by,
          modified_by
      });

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

    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
      if (req.user.role !== "admin") {
          return res.status(403).json({ error: "Access forbidden: insufficient permissions" });
      }
      const users = await User.findAll(); 
      res.json(users);
  } catch (error) {
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

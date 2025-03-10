const FlightStatusMaster = require("../models/FlightStatusMaster");
 // Debug: Check if the model is imported correctly

// Get all statuses
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await FlightStatusMaster.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single status by ID
const getStatusById = async (req, res) => {
  try {
    const status = await FlightStatusMaster.findByPk(req.params.id);
    if (status) {
      res.json(status);
    } else {
      res.status(404).json({ message: "Status not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new status
const createStatus = async (req, res) => {
  try {
    const { status_name } = req.body;

    // Debug log to check req.user
    console.log("Request User:", req.user);

    // Use the logged-in user's ID for created_by and modified_by
    const created_by = req.user.user_id; // Assuming req.user.user_id contains the logged-in user's ID
    const modified_by = req.user.user_id;

    const newStatus = await FlightStatusMaster.create({
      status_name,
      created_by, // Use the logged-in user's ID
      modified_by, // Use the logged-in user's ID
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating flight status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a status by ID
const updateStatus = async (req, res) => {
  try {
    const { status_name } = req.body;

    // Use the logged-in user's ID for modified_by
    const modified_by = req.user.user_id; // Assuming req.user.user_id contains the logged-in user's ID

    const updatedStatus = await FlightStatusMaster.update(
      {
        status_name,
        modified_by, // Use the logged-in user's ID
      },
      {
        where: { status_id: req.params.id },
      }
    );

    if (updatedStatus[0] === 1) {
      res.json({ message: "Status updated successfully" });
    } else {
      res.status(404).json({ message: "Status not found" });
    }
  } catch (error) {
    console.error("Error updating flight status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a status by ID
const deleteStatus = async (req, res) => {
  try {
    const deletedStatus = await FlightStatusMaster.destroy({
      where: { status_id: req.params.id },
    });
    if (deletedStatus === 1) {
      res.json({ message: "Status deleted successfully" });
    } else {
      res.status(404).json({ message: "Status not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
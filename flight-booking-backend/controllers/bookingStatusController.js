const BookingStatusMaster = require("../models/BookingStatusMaster");

// Get all statuses
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await BookingStatusMaster.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single status by ID
const getStatusById = async (req, res) => {
  try {
    const status = await BookingStatusMaster.findByPk(req.params.id);
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
const userMapping = {
    "admin_static_id": 1, // Map "admin_static_id" to integer 1
    // Add other mappings as needed
  };
  
  // Create a new status
  const createStatus = async (req, res) => {
    try {
      const { status_name } = req.body;
  
      // Debug log to check req.user
      console.log("Request User:", req.user);
  
      // Map req.user.user_id to a valid integer
      const created_by = userMapping[req.user.user_id];
      const modified_by = userMapping[req.user.user_id];
  
      if (created_by === undefined || modified_by === undefined) {
        throw new Error("Invalid user_id mapping");
      }
  
      const newStatus = await BookingStatusMaster.create({
        status_name,
        created_by, // Use the mapped integer
        modified_by, // Use the mapped integer
      });
  
      res.status(201).json(newStatus);
    } catch (error) {
      console.error("Error creating booking status:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a status by ID
  const updateStatus = async (req, res) => {
    try {
      const { status_name } = req.body;
  
      // Map req.user.user_id to a valid integer
      const modified_by = userMapping[req.user.user_id];
  
      if (modified_by === undefined) {
        throw new Error("Invalid user_id mapping");
      }
  
      const updatedStatus = await BookingStatusMaster.update(
        {
          status_name,
          modified_by, // Use the mapped integer
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
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Delete a status by ID
const deleteStatus = async (req, res) => {
  try {
    const deletedStatus = await BookingStatusMaster.destroy({
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
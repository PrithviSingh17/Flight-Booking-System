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
  const createStatus = async (req, res) => {
    try {
      const { status_id, status_name } = req.body;
      const created_by = req.user.user_id; // Dynamically set created_by to the logged-in user's ID
  
      // Check if the status_id already exists
      const existingStatus = await BookingStatusMaster.findByPk(status_id);
      if (existingStatus) {
        return res.status(400).json({ error: "status_id already exists" });
      }
  
      const newStatus = await BookingStatusMaster.create({
        status_id,
        status_name,
        created_by,
        modified_by: created_by, // Set modified_by to the same user
      });
      res.status(201).json(newStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a status by ID
  const updateStatus = async (req, res) => {
    try {
      const { status_id, status_name } = req.body;
      const created_by = req.user.user_id; // Dynamically set created_by to the logged-in user's ID
  
      // Check if the status_id already exists
      const existingStatus = await BookingStatusMaster.findByPk(status_id);
      if (existingStatus) {
        return res.status(400).json({ error: "status_id already exists" });
      }
  
      const newStatus = await BookingStatusMaster.create({
        status_id,
        status_name,
        created_by,
        modified_by: created_by, // Set modified_by to the same user
      });
      res.status(201).json(newStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a booking status
  exports.updateBookingStatus = async (req, res) => {
    try {
      const { status_id } = req.params;
      const { status_name } = req.body;
      const modified_by = req.user.user_id; // Dynamically set modified_by to the logged-in user's ID
  
      const status = await BookingStatusMaster.findByPk(status_id);
      if (!status) {
        return res.status(404).json({ error: "Booking status not found" });
      }
  
      status.status_name = status_name;
      status.modified_by = modified_by;
      await status.save();
  
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
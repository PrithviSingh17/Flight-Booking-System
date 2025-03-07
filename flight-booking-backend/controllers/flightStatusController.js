const { DataTypes } = require("sequelize");
const FlightStatus = require("../models/FlightStatus");
const FlightStatusMaster = require("../models/FlightStatusMaster")
const Flight = require("../models/Flight");



exports.createFlightStatus = async (req, res) => {
    try {
        const { flight_id, status_name_id} = req.body;

        const flightStatus = await FlightStatus.create({
            flight_id,
            status_name_id,
            created_by: req.user.user_id,
            modified_by: req.user.user_id,
        });

        return res.status(201).json(flightStatus);
    } catch (error) {
        console.error("Error creating flight status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getAllFlightStatus = async (req, res) => {
    try {
      const flightStatuses = await FlightStatus.findAll({
        include: [
          {
            model: Flight,
            attributes: ["flight_number"], 
          },
  
        ],
      });
  
      console.log("Flight Statuses Fetched:", JSON.stringify(flightStatuses, null, 2)); // Debug log
      res.json(flightStatuses);
    } catch (error) {
      console.error("Error fetching flight statuses:", error);
      res.status(500).json({ error: error.message });
    }
  };

exports.getFlightStatusById = async (req, res) => {
    try {
        const { status_id } = req.params;
        const flightStatus = await FlightStatus.findByPk(status_id,
            {include: [
                {
                  model: Flight,
            attributes: ["flight_number"], // Include status_name from FlightStatusMaster
                },
              ],
            });

        if (!flightStatus) {
            return res.status(404).json({ error: "Flight status not found" });
        }

        return res.status(200).json(flightStatus);
    } catch (error) {
        console.error("Error fetching flight status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateFlightStatus = async (req, res) => {
    try {
        const { status_id } = req.params;
        const { status_name_id, modified_by } = req.body;

        const flightStatus = await FlightStatus.findByPk(status_id);
        if (!flightStatus) {
            return res.status(404).json({ error: "Flight status not found" });
        }

        flightStatus.status_name_id = status_name_id;
        flightStatus.modified_by = modified_by;
        flightStatus.modified_at = new Date();

        await flightStatus.save();
        return res.status(200).json({ message: "Flight status updated successfully" });
    } catch (error) {
        console.error("Error updating flight status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteFlightStatus = async (req, res) => {
    try {
        const { status_id } = req.params;
        const flightStatus = await FlightStatus.findByPk(status_id);

        if (!flightStatus) {
            return res.status(404).json({ error: "Flight status not found" });
        }

        await flightStatus.destroy();
        return res.status(200).json({ message: "Flight status deleted successfully" });
    } catch (error) {
        console.error("Error deleting flight status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
module.exports = {
    createFlightStatus: exports.createFlightStatus,
    getAllFlightStatus: exports.getAllFlightStatus,
    getFlightStatusById: exports.getFlightStatusById,
    updateFlightStatus: exports.updateFlightStatus,
    deleteFlightStatus: exports.deleteFlightStatus,
    getAllStatusNames: exports.getAllStatusNames
};
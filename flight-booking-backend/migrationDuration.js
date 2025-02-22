const { QueryTypes } = require("sequelize");
const sequelize = require("./config/db"); // Adjust the path to your Sequelize config

async function migrateDurations() {
  try {
    // Fetch all flights
    const flights = await sequelize.query("SELECT * FROM flights", { type: QueryTypes.SELECT });

    for (const flight of flights) {
      let durationValue = flight.duration;

      // Handle cases where duration is not a string
      if (typeof durationValue === "string") {
        // If duration is a string, assume it's in "HH:mm:ss" or "HH hours MM minutes" format
        const parts = durationValue.split(/[: ]+/); // Split by ":" or space
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        durationValue = hours * 60 + minutes; // Convert to minutes
      } else if (typeof durationValue === "number") {
        // If duration is already a number, assume it's in minutes
        durationValue = Math.floor(durationValue); // Ensure it's an integer
      } else {
        // If duration is null, undefined, or invalid, set a default value
        durationValue = 0;
      }

      // Update the flight with the new duration
      await sequelize.query(
        `UPDATE flights SET duration = ${durationValue} WHERE flight_id = ${flight.flight_id}`,
        { type: QueryTypes.UPDATE }
      );
    }

    console.log("Duration migration completed successfully.");
  } catch (error) {
    console.error("Error migrating durations:", error);
  }
}

migrateDurations();
module.exports = (sequelize, DataTypes) => {
    const FlightStatusMaster = sequelize.define("flightstatusmaster", {
        status_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
          }
    }, {
        tableName: "flight_status_master",
        timestamps: false
    });

    return FlightStatusMaster;
};

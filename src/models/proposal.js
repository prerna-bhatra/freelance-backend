// models/User.js
module.exports = (sequelize, Sequelize) => {
  const Proposals = sequelize.define(
    "Proposals",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      deadline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      charges: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      coverLetter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("PENDING", "ACCEPTED", "REJECTED", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      timestamps: true,
    }
  );

  return Proposals;
};

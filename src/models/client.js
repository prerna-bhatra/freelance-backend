// models/User.js
module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define(
    "Client",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companySize: {
        type: Sequelize.ENUM(
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1001+"
        ),
        allowNull: false,
        defaultValue: "1-10",
      },
      websiteURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      totalFundingin$: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1000,
      },
    },
    {
      timestamps: true,
    }
  );

  return Client;
};

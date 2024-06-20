// models/User.js
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('CLIENT', 'FREELANCER'), 

      }
    },
    {
      timestamps: true,
    }
  );

  return User;
};

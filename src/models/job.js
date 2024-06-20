// models/User.js
module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define(
    "Job",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      projectScope: {
        type: Sequelize.ENUM("large", "medium", "small"), 
        allowNull: false, 
      },
      timeRequired: {
        // type: Sequelize.ENUM("0-1 month", "1-6 months", "more than 6 months"),
        type : Sequelize.STRING,
        allowNull: false,
      },
      experience: {
        type: Sequelize.ENUM("Beginner", "Intermediate", "Expert"), // Define experience as an ENUM
        allowNull: false,
        defaultValue: "Beginner",
      },
      contractType: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
      budget: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true, 
      },
    },
    {
      timestamps: true,
    }
  );

  return Job;
};


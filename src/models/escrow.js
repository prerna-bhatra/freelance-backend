// models/Escrow.js
module.exports = (sequelize, Sequelize) => {
    const Escrow = sequelize.define(
      "Escrow",
      {
        id : {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        clientId: {
            type: Sequelize.UUID,
            allowNull: false,
           
          },
        jobId: {
          type: Sequelize.UUID,
          allowNull: false,
          
        },
        JobStatus: {
          type: Sequelize.ENUM("NOT PUBLISHED", "DRAFT", "PUBLISHED"),
          allowNull: true,
          defaultValue: "NOT PUBLISHED",
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,

        },
        freelancerId: { 
          type: Sequelize.UUID,
          allowNull: true,
          
        },
        freelancerWorkStatus: {
          type: Sequelize.ENUM("NOT STARTED", "STARTED", "ONGOING", "COMPLETED"),
          allowNull: false,
          defaultValue: "NOT STARTED",
        },
      },
      {
        timestamps: true,
      }
    );
  
    return Escrow;
  };
  
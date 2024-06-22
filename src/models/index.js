const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/db.config");
const pg = require("pg")


const sequelize = new Sequelize(
  "b5h8ikrilho6eembv7r5",
  "u6sxbk276jis0ddlaqn9",
  "7eoQT2Tb9CycpS9PICivmdC2730mH1",
  {
    port: '50013',
    host: "b5h8ikrilho6eembv7r5-postgresql.services.clever-cloud.com",
    dialect: config.env.development.dialect,
    sslmode: config.env.development.sslmode,
    dialectModule: pg,
  }
);

// const sequelizeProd = new Sequelize(
//     config.env.production.database,
//     config.env.production.username,
//     config.env.production.password,
//     {
//       host:  config.env.production.host,
//       dialect:  config.env.production.dialect

//     }
//   );

const db = {};

db.sequelize = sequelize;
// proddb.sequelize =  sequelizeProd

db.User = require("../models/user")(sequelize, Sequelize);
db.Freelancer = require("../models/freelancer")(sequelize, Sequelize);
db.Client = require("../models/client")(sequelize, Sequelize);
db.Job = require("../models/job")(sequelize, Sequelize);
db.Proposals = require("../models/proposal")(sequelize, Sequelize);
db.Escrow = require("../models/escrow")(sequelize, Sequelize);

db.Job.hasOne(db.Escrow, { foreignKey: "jobId" });
db.Escrow.belongsTo(db.Job, { foreignKey: "jobId" });

db.Client.hasMany(db.Escrow, { foreignKey: "clientId" });
db.Escrow.belongsTo(db.Freelancer, { foreignKey: "clientId" });

db.Freelancer.hasMany(db.Escrow, { foreignKey: "freelancerId" });
db.Escrow.belongsTo(db.Freelancer, { foreignKey: "freelancerId" });

db.User.hasOne(db.Client, {
  foreignKey: "userId",
  as: "Client",
});
db.Client.belongsTo(db.User, {
  foreignKey: "userId",
  as: "User",
});

db.User.hasOne(db.Freelancer, {
  foreignKey: "userId",
  as: "Freelancer",
});
db.Freelancer.belongsTo(db.User, {
  foreignKey: "userId",
  as: "User",
});

db.Client.hasMany(db.Job, {
  foreignKey: "clientId",
  as: "Job",
});
db.Job.belongsTo(db.Client, {
  foreignKey: "clientId",
  as: "Client",
});

db.Freelancer.hasMany(db.Proposals, {
  foreignKey: "freelancerId",
  as: "Proposals",
});
db.Proposals.belongsTo(db.Freelancer, {
  foreignKey: "freelancerId",
  as: "Freelancer",
});

db.Job.hasMany(db.Proposals, {
  foreignKey: "jobId",
  as: "Proposals",
});
db.Proposals.belongsTo(db.Job, {
  foreignKey: "jobId",
  as: "Job",
});

module.exports = { db };

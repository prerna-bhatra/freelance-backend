
require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");
const { db } = require("./src/models");
const indexRouter = require("./src/routes/api");
// const https = require('https');
// const fs = require('fs');

const PORT = process.env.PORT || 8000; 



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.use("/api", indexRouter);

// Routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to Bidding server!" });
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err);
  });
 
console.log('Welcome to IndexJS of Bidding Backend !!!')

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

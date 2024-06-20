const express = require("express");
const router = express.Router();
const jobController = require("../../../controllers/job.controller");
const { JWTAuth } = require("../../../middlewares")

router.post("/", [JWTAuth.verifyToken , JWTAuth.isClient], jobController.createJob );
router.get("/", [JWTAuth.verifyToken], jobController.getAllJobs );
router.get("/:id", [JWTAuth.verifyToken], jobController.getJobById );
router.get("/client/:clientId",[JWTAuth.verifyToken], jobController.getJobByClientID );

module.exports = router; 

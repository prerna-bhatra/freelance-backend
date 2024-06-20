const express = require("express");
const router = express.Router();
const freelancerController = require("../../../controllers/freelancers.controller");
const { JWTAuth } = require("../../../middlewares")

router.post("/", [JWTAuth.verifyToken], freelancerController.createFreelancer );
router.get("/:id", [JWTAuth.verifyToken], freelancerController.getFreelancerById );
router.get("/", [JWTAuth.verifyToken], freelancerController.getFreelancers );
router.delete("/:id",[JWTAuth.verifyToken], freelancerController.deleteFreelancerById );

router.get("/user/:userId", [JWTAuth.verifyToken], freelancerController.getFreelancerByUserId );


module.exports = router; 

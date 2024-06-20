const express = require("express");
const router = express.Router();
const authController = require("../../../controllers/auth.controller");

router.post("/register", authController.signupUser );
router.get("/:id", authController.getUserById );
router.post("/login", authController.loginUser );

module.exports = router; 
 

/**
 * FREELANCER
 * 
 * user11@gmail.com | User11@123
 * 
 * CLIENT
 * 
 * user1@gmail.com | User1@123
 * user78@gmail.com | User78@123
 */
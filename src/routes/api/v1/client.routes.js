const express = require("express");
const router = express.Router();
const clientController = require("../../../controllers/client.controller");
const { JWTAuth } = require("../../../middlewares")

router.post("/", [JWTAuth.verifyToken], clientController.createClient );
router.get("/", [JWTAuth.verifyToken], clientController.getAllClients );
router.get("/:id", [JWTAuth.verifyToken], clientController.getClientById );
router.delete("/:id",[JWTAuth.verifyToken], clientController.deleteClientById );

router.get("/user/:userId", [JWTAuth.verifyToken], clientController.getClientByUserId);

module.exports = router; 

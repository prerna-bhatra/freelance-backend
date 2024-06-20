const express = require("express");
const router = express.Router();
const proposalController = require("../../../controllers/proposal.controller");
const { JWTAuth } = require("../../../middlewares")

router.post("/", [JWTAuth.verifyToken , JWTAuth.isFreelancer], proposalController.createProposal );
router.get("/:id", [JWTAuth.verifyToken], proposalController.getProposalById );
router.get("/jobs/:jobId",[JWTAuth.verifyToken], proposalController.getProposalsByJobId );
router.get("/freelancers/:freelancerId",[JWTAuth.verifyToken], proposalController.getProposalByFreelancerID );
router.put("/:id", [JWTAuth.verifyToken ], proposalController.updateProposalByID );
module.exports = router; 

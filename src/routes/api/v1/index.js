const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes");
const freelancerRoutes = require("./freelancer.routes");
const ClientRoutes = require("./client.routes");
const jobRoutes = require("./jobs.routes");
const proposalRoutes = require("./proposals.routes")



router.use("/auth" , authRouter);
router.use("/user/freelancers" , freelancerRoutes);
router.use("/user/clients" , ClientRoutes);
router.use("/jobs" , jobRoutes);
router.use("/proposals" , proposalRoutes); 
module.exports = router;
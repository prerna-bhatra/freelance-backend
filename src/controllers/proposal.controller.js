const { db } = require("../models");
const User = db.User;
const Proposal = db.Proposals;
const Freelancer = db.Freelancer;
const Job = db.Job;
const Escrow = db.Escrow;
const Client = db.Client;
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { sendEmail } = require("../utils/emailService");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
}).single("coverLetter");

const createProposal = async (req, res) => {
  try {
    // Check if title is provided

    upload(req, res, async (err) => {
      // console.log("Loadbefore  :", req.file, req.body);
      if (err) {
        console.log("Error uploading file:", err);
        return res.status(500).json({ message: "Error uploading file", err });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const { description, jobId, deadline, charges } = req.body;
      // console.log("Load  :", req.file, req.body);
      console.log(
        "fileAccess : ",
        process.env.ACCESS_KEY,
        process.env.SECRET_ACCESS_KEY,
        process.env.S3_BUCKET
      );

      if (!description) {
        return res
          .status(400)
          .json({ success: false, message: "Description is required" });
      }

      if (!jobId) {
        return res
          .status(400)
          .json({ success: false, message: "Job ID is required" });
      }

      if (!charges) {
        return res
          .status(400)
          .json({ success: false, message: "Charges are required" });
      }

      // this.client.send is not a function
      const userId = req.id;

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      let coverLetter = null;
      if (req.file) {
        coverLetter = req.file.location;
      }

      const freelancer = await Freelancer.findOne({ where: { userId } });

      if (!freelancer) {
        return res.status(404).json({
          success: false,
          message: "Freelancer not found for this userID",
        });
      }

      const job = await Job.findOne({ where: { id: jobId } });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found for this JobID",
        });
      }

      // Check if a proposal already exists for this job and freelancer
      const existingProposal = await Proposal.findOne({
        where: { jobId, freelancerId: freelancer.id },
      });

      if (existingProposal) {
        return res.status(400).json({
          success: false,
          message: "Proposal already exists for this Job ID and Freelancer",
        });
      }

      // Create the Proposal
      const newProposal = await Proposal.create({
        freelancerId: freelancer.id,
        jobId,
        description,
        deadline,
        charges,
        coverLetter,
      });

      // Respond with success message and the created Proposal
      return res.status(201).json({
        success: true,
        message: "Proposal Created Successfully!",
        Proposal: newProposal,
      });
    });
  } catch (error) {
    console.error("Error creating Proposal:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a Proposal by ID
const getProposalById = async (req, res) => {
  const { id } = req.params;

  try {
    const proposal = await Proposal.findOne({
      where: { id },
      include: [
        {
          model: db.Job,
          attributes: ["id", "title", "skills", "budget", "description"],
          as: "Job",
        },

        {
          model: db.Freelancer,
          attributes: ["id", "amountCredited", "skills"],
          as: "Freelancer",
          include: {
            model: db.User,
            attributes: ["id", "username", "email"],
            as: "User",
          },
        },
      ],
    });

    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, proposal });
  } catch (error) {
    console.error("Error fetching Proposal by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a Proposal by ID
const getProposalByFreelancerID = async (req, res) => {
  const { freelancerId } = req.params;

  try {
    const freelancer = await Freelancer.findOne({
      where: { id: freelancerId },
    });
    if (!freelancer) {
      return res
        .status(404)
        .json({ success: false, message: "Freelancer not found" });
    }
    const Proposals = await Proposal.findAll({
      where: { freelancerId },
      include: {
        model: db.Freelancer,
        attributes: ["id", "amountCredited", "skills"],
        as: "Freelancer",
        include: {
          model: db.User,
          attributes: ["id", "username", "email"],
          as: "User",
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Proposal fetched successfully!",
      TotalProposals: Proposals.length,
      Proposals,
    });
  } catch (error) {
    console.error("Error fetching Proposal by Freelancer ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Proposals by Job ID
const getProposalsByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findOne({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const proposals = await Proposal.findAll({
      where: { jobId },
      include: [
        {
          model: db.Job,
          attributes: ["id", "title", "budget", "description"],
          as: "Job",
        },

        {
          model: db.Freelancer,
          attributes: ["id", "amountCredited", "skills"],
          as: "Freelancer",
          include: {
            model: db.User,
            attributes: ["id", "username", "email"],
            as: "User",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully by jobID",
      TotalProposals: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error("Error fetching proposals by Job ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProposalByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const proposal = await Proposal.findByPk(id);
    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    const prevProposalStatus = "ACCEPTED";
    if (status) {
      proposal.status = status;
    }

    await proposal.save();
    const freelancer = await Freelancer.findOne({
      where: { id: proposal.freelancerId },
    });
    const user = await User.findOne({ where: { id: freelancer.userId } });
    // Update the Escrow entry if the proposal status is ACCEPTED
    if (proposal.status === "ACCEPTED") {
      const escrow = await Escrow.findOne({ where: { jobId: proposal.jobId } });

      if (!escrow) {
        return res
          .status(404)
          .json({ success: false, message: "Escrow not found for the job" });
      }

      escrow.freelancerId = proposal.freelancerId;
      escrow.freelancerWorkStatus = "STARTED";
      const escrowUpdated = await escrow.save();
      console.log(
        `Accepted Freelancer ${proposal.freelancerId} Proposal and updated the Freelancerwork status to ${escrow.freelancerWorkStatus}`
      );
      console.log("Escrow : ", escrowUpdated);
    }

    if (prevProposalStatus === "ACCEPTED" && proposal.status === "COMPLETED") {
      const escrow = await Escrow.findOne({ where: { jobId: proposal.jobId } });

      if (!escrow) {
        return res
          .status(404)
          .json({ success: false, message: "Escrow not found for the job" });
      }

      console.log("Freelancer before : ", freelancer);
      freelancer.amountCredited = freelancer.amountCredited + proposal.charges;

      await freelancer.save();
      console.log("Freelancer After : ", freelancer);

      escrow.freelancerId = proposal.freelancerId;
      escrow.freelancerWorkStatus = "COMPLETED";
      escrow.amount = escrow.amount - proposal.charges;

      const job = await Job.findOne({ where: { id: proposal.jobId } });
      const client = await Client.findOne({ where: { id: job.clientId } });
      client.totalFundingin$ = client.totalFundingin$ + escrow.amount;

      const clientupdated = await client.save();
      const escrowUpdated = await escrow.save();
      console.log(
        `Completed Work! , Added Money to Freelancer Account ${freelancer.amountCredited} and Remaining Money to Client ${client.totalFundingin$}`
      );

      console.log("Escrow : ", escrowUpdated);
      console.log("ClientUpdated : ", clientupdated);
    }

    await sendEmail(
      "Proposal Status Update",
      `Your proposal status has been updated to: ${proposal.status}`,
      user.email
    );

    res.status(200).json({
      success: true,
      message: "Proposals updated successfully",
      proposal,
    });
  } catch (error) {
    console.error("Error updating Proposal information:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProposal,
  getProposalById,
  getProposalByFreelancerID,
  getProposalsByJobId,
  updateProposalByID,
};

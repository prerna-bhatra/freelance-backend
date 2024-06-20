const { db } = require("../models");
const User = db.User;
const Job = db.Job;
const Client = db.Client;
const Escrow = db.Escrow;
const {
  validateProjectScope,
  validateExperience,
  validateBudget,
} = require("../utils/validations");

const createJob = async (req, res) => {
  try {
    // Extract job details from request body
    const {
      title,
      skills,
      projectScope,
      timeRequired,
      experience,
      contractType,
      budget,
      description,
    } = req.body;

    // Check if title is provided
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    // Check if skills are provided
    if (!skills) {
      return res
        .status(400)
        .json({ success: false, message: "Skills are required" });
    }

    // Check if projectScope is provided
    if (!projectScope) {
      return res
        .status(400)
        .json({ success: false, message: "Project scope is required" });
    }

    // Check if timeRequired is provided
    if (!timeRequired) {
      return res
        .status(400)
        .json({ success: false, message: "Time required is required" });
    }

    // Check if experience is provided
    if (!experience) {
      return res
        .status(400)
        .json({ success: false, message: "Experience is required" });
    }

    // Check if contractType is provided
    if (!contractType) {
      return res
        .status(400)
        .json({ success: false, message: "Contract type is required" });
    }

    // Check if budget is provided
    if (!budget) {
      return res
        .status(400)
        .json({ success: false, message: "Budget is required" });
    }

    // Check if description is provided
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }

    const userId = req.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const client = await Client.findOne({ where: { userId } });

    // Validate projectScope, experience, and budget
    validateProjectScope(projectScope);
    validateExperience(experience);
    validateBudget(budget);

    if (budget && budget > client.totalFundingin$) {
     
      return res.status(400).json({
        success: false,
        message: "Can't create a Job , Job Budget is Greater than Funding!",
      });
    }

    // Create the job
    const newJob = await Job.create({
      clientId: client.id,
      title,
      skills,
      projectScope,
      timeRequired,
      experience,
      contractType,
      budget,
      description,
    });

    // NOTE - payment Integration part will create soon
    let isPaymentSuccessfull = true;

    if (isPaymentSuccessfull) {
      // Create Escrow Entry

      const remainingFundingAmount = client.totalFundingin$ - newJob.budget;
      const newEscrow = await Escrow.create({
        clientId: client.id,
        jobId: newJob.id,
        JobStatus: "PUBLISHED",
        amount: newJob.budget, //
        freelancerId: null, // Update if a freelancer is assigned immediately
        freelancerWorkStatus: "NOT STARTED",
      });

      client.totalFundingin$ = remainingFundingAmount;

      await client.save();

      // Respond with success message and the created job
      res.status(201).json({
        success: true,
        message: "Job posted successfully!",
        job: newJob,
      });
    } else {
      await Escrow.create({
        clientId: client.id,
        jobId: newJob.id,
        JobStatus: "DRAFT",
        amount: 0,
        freelancerId: null, // Update if a freelancer is assigned immediately
        freelancerWorkStatus: "NOT STARTED",
      });

      res.status(400).json({
        success: false,
        message: "Oops!, Add AMOUNT in Escrow to Publish the Job !!",
      });
    }
  } catch (error) {
    console.error("Error creating job:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    // Get page, limit, and experience from query params, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const experience = req.query.experience;
    const offset = (page - 1) * limit;

    // Build the query options
    const queryOptions = {
      limit,
      offset,
      include: {
        model: db.Client,
        attributes: [
          "id",
          "companyName",
          "companySize",
          "websiteURL",
          "totalFundingin$",
        ],
        as: "Client",
        include: {
          model: db.User,
          attributes: ["id", "username", "email"],
          as: "User",
        },
      },
    };

    // Add experience filter if provided
    if (experience) {
      queryOptions.where = { experience };
    }

    // Fetch jobs with pagination and filtering
    const { count, rows: jobs } = await Job.findAndCountAll(queryOptions);

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      TotalJobs: count,
      currentPage: page,
      pageSize: limit,
      totalPages,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// Get a job by ID
const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findOne({
      where: { id },
      include: {
        model: db.Client,
        attributes: [
          "id",
          "companyName",
          "companySize",
          "websiteURL",
          "totalFundingin$",
        ],
        as: "Client",
        include: {
          model: db.User,
          attributes: ["id", "username", "email"],
          as: "User",
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a job by Client ID
const getJobByClientID = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findOne({ where: { id: clientId } });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    const jobs = await Job.findAll({
      where: { clientId },
      include: [
        {
          model: db.Proposals,
        attributes: [
          "id",
          "charges",
        ],
        as: "Proposals",

        },
        {
        model: db.Client,
        attributes: [
          "id",
          "companyName",
          "companySize",
          "websiteURL",
          "totalFundingin$",
        ],
        as: "Client",
        include: {
          model: db.User,
          attributes: ["id", "username", "email"],
          as: "User",
        },
      },]
    });

    res.status(200).json({
      success: true,
      message: "Job fetched successfully!",
      TotalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobByClientID,
};

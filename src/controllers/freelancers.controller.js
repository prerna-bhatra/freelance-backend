const bcrypt = require("bcrypt");
const { db } = require("../models");
const Freelancer = db.Freelancer;
const User = db.User;
const jwt = require("jsonwebtoken");

const { userTypes, experience } = require("../utils/constants");

const createFreelancer = async (req, res) => {
  try {
    const { skills, experience } = req.body;

    const userId = req.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const validExperienceLevels = ["Beginner", "Intermediate", "Expert"];
    if (!validExperienceLevels.includes(experience)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid experience level. Must be 'Beginner', 'Intermediate', or 'Expert'",
      });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const freelancer = await Freelancer.findOne({ where: { userId } });

    if (freelancer) {
      return res.status(400).json({
        success: false,
        message: "User already has a Freelancer profile",
      });
    }

    if (user.userType !== userTypes.freelancer) {
      return res.status(400).json({
        success: false,
        message:
          "User must have userType 'FREELANCER' t o create a Freelancer profile",
      });
    }

    const newFreelancer = await Freelancer.create({
      userId,
      skills,
      experience,
    });

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Freelancer created successfully!",
      freelancer: newFreelancer,
    });
  } catch (error) {
    console.error("Error creating freelancer:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getFreelancers = async (req, res) => {
  try {
    // Retrieve all Freelancers from the database
    const freelancers = await Freelancer.findAll({
      include : {
        model: db.User,
        attributes: ["id", "username", "email"],
        as: "User",
      }
  });
    res.status(200).json({ success: true, freelancers });
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Get a Freelancer by ID
const getFreelancerById = async (req, res) => {
  const { id } = req.params;

  try {
    const freelancer = await Freelancer.findOne({ where : { id } ,  
      
        include : {
          model: db.User,
          attributes: ["id", "username", "email"],
          as: "User",
        }
    }
    );

    if (!freelancer) {
      return res
        .status(404)
        .json({ success: false, message: "Freelancer ID not found" });
    }

    // if (freelancer.userId !== req.id) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Unauthorized access" });
    // }

    res.status(200).json({ success: true, freelancer });
  } catch (error) {
    console.error("Error fetching Freelancer by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getFreelancerByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const freelancer = await Freelancer.findOne({ where: { userId } , include : {
      model: db.User,
      attributes: ["id", "username", "email"],
      as: "User",
    } });

    if (!freelancer) {
      return res.status(404).json({ success: false, message: "Freelancer not found for the given User ID" });
    }

    res.status(200).json({ success: true, freelancer });
  } catch (error) {
    console.error("Error fetching Freelancer by User ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a Freelancer by ID
const deleteFreelancerById = async (req, res) => {
  const { id } = req.params;

  try {
    const freelancer = await Freelancer.findByPk(id);

    if (!freelancer) {
      return res
        .status(404)
        .json({ success: false, message: "Freelancer not found" });
    }

    if (freelancer.userId !== req.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    await freelancer.destroy();

    res
      .status(200)
      .json({ success: true, message: "Freelancer deleted successfully" });
  } catch (error) {
    console.error("Error deleting Freelancer by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createFreelancer,
  getFreelancers,
  getFreelancerById,
  deleteFreelancerById,
  getFreelancerByUserId,
};

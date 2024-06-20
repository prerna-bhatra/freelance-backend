const { db } = require("../models");
const { userTypes } = require("../utils/constants");
const { isValidCompanySize } = require("../utils/validations");
const Client = db.Client;
const User = db.User;

// Create a new Client
const createClient = async (req, res) => {
  try {
    const { companyName, companySize, websiteURL, totalFundingin$ } = req.body;

    const userId = req.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    if (!companyName || !companySize) {
      return res.status(400).json({
        success: false,
        message: "company name, and company size are required",
      });
    }

    // if( !totalFundingin$ ){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Oops! , You missed to enter the funded amount for the Company!"
    //   })
    // }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const client = await Client.findOne({ where: { userId } });

    if (client) {
      return res.status(400).json({
        success: false,
        message: "User already has a CLIENT profile",
      });
    }

    if (user.userType !== userTypes.client) {
      return res.status(401).json({
        success: false,
        message: "User must have userType 'CLIENT' to create a CLIENT profile",
      });
    }

    if (!isValidCompanySize(companySize)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid company size. Must be one of: '1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'",
      });
    }

    const newClient = await Client.create({
      userId,
      companyName,
      companySize,
      websiteURL,
      totalFundingin$,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully!",
      client: newClient,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Get all Clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: {
        model: db.User,
        attributes: ["id", "username", "email"],
        as: "User",
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Get a Client by ID
const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findOne({
      where: { id },
      include: {
        model: db.User,
        attributes: ["id", "username", "email"],
        as: "User",
      },
    });

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    if (client.userId !== req.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    console.error("Error fetching Client by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Delete a Client by ID
const deleteClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    if (client.userId !== req.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    await client.destroy();

    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting Client by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getClientByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const client = await Client.findOne({
      where: { userId },
      include: {
        model: db.User,
        attributes: ["id", "username", "email"],
        as: "User",
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found for the given User ID",
      });
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    console.error("Error fetching Client by User ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  deleteClientById,
  getClientByUserId,
};

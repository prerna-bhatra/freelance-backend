const jwt = require("jsonwebtoken");
const { userTypes } = require("../utils/constants");
const {db} = require("../models");
const User = db.User;

function verifyToken(req, res, next) {
  /**
   * Read the token from the Header
   */
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token Provided",
    });
  }

  // If the Token was provided , we need to verify it
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorised",
      });
    }

    // I will try to read the UserID from the decoded token and store it in req object
    req.id = decoded.id;
    next();
  });
}

const isClient = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.id } });

  if (user && user.userType == userTypes.client) {
    console.log("This is CLIENT User !");
    next();
  } else {
    return res.status(403).send({
      message: "Require CLIENT Role",
    });
  }
};

const isFreelancer = async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.id } });
  
    if (user && user.userType == userTypes.freelancer) {
      console.log("This is Freelancer User !");
      next();
    } else {
      return res.status(403).send({
        message: "Require Freelancer Role",
      });
    }
  };
module.exports = { verifyToken, isClient , isFreelancer };

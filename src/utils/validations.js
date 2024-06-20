// Function to validate email format
const { experience, scope } = require("./constants");
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate phone number format
const isValidPhoneNumber = (phone_number) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone_number);
};

// Function to validate password
const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one digit";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  // If all validations pass, return null
  return null;
};

const isValidCompanySize = (size) => {
  const validSizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+",
  ];
  return validSizes.includes(size);
};

// jobValidations.js


// Validate projectScope
const validateProjectScope = (projectScope) => {
  const validProjectScopes = [scope.large, scope.medium, scope.small];
  if (!validProjectScopes.includes(projectScope)) {
    throw new Error(
      "Invalid projectScope. Must be one of: 'large', 'medium', 'small'"
    );
  }
};

// Validate experience
const validateExperience = (exp) => {
  const validExperiences = [
    experience.beginner,
    experience.Intermediate,
    experience.expert,
  ];
  if (!validExperiences.includes(exp)) {
    throw new Error(
      "Invalid experience. Must be one of: 'Beginner', 'Intermediate', 'Expert'"
    );
  }
};

// Validate budget
const validateBudget = (budget) => {
  if (isNaN(budget) || budget <= 0) {
    throw new Error("Budget must be a positive number");
  }
};


module.exports = {
  validateProjectScope,
  validateExperience,
  validateBudget,
  validatePassword,
  isValidEmail,
  isValidPhoneNumber,
  isValidCompanySize,
};

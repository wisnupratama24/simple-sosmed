const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRET_JWT_REGISTER } = require("../config");

module.exports.checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_JWT_REGISTER);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }

    throw new Error("Authentication token must be  'Bearer [token]");
  }

  throw new Error("Authorization header must be provided");
};

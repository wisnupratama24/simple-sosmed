const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_JWT_REGISTER } = require("../../config");
const {
  validationRegister,
  validationLogin,
} = require("../../utils/validation");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    SECRET_JWT_REGISTER,
    { expiresIn: "1d" }
  );
}

module.exports = {
  Mutation: {
    async registerUser(
      _,
      { registerUser: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validationRegister(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({
        $or: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username/email is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async loginUser(_, { username, password }) {
      const { valid, errors } = validationLogin(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "Username not found";
        throw new UserInputError("Username not found", { errors });
      }

      match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong password";
        throw new UserInputError("Wrong password", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};

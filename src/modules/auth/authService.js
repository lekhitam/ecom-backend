const apiError = require("../../utils/appiError.js");
const UserModel = require("../../models/user.model");
const RefreshTokenModel = require("../../models/refreshToken.model");
const {
  hashPassword,
  verifyPassword,
} = require("../../utils/password");

const registerService = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw apiError(409, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  const response = await UserModel.findById(user._id).select("-password");

  return {
    user: response,
  };
};

const loginService = async (data) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw apiError(401, "Incorrect email or password");
  }

  const passwordCorrect = await verifyPassword(
    password,
    user.password
  );

  if (!passwordCorrect) {
    throw apiError(401, "Incorrect email or password");
  }

  const response = await UserModel.findById(user._id).select("-password");

  return {
    user: response,
  };
};

const logoutService = async (refreshToken) => {
  if (refreshToken) {
    await RefreshTokenModel.deleteOne({
      tokenHash: refreshToken,
    });
  }

  return true;
};

module.exports = {
  registerService,
  loginService,
  logoutService,
};
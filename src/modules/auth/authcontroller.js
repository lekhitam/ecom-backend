const asyncHandler = require("../../utils/asynchandeler");
const apiResponse = require("../../utils/apiResponse");
const authService = require("./authService");

const RefreshTokenModel = require("../../models/refreshToken.model");

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  accessCookieOptions,
  refreshCookieOptions,
} = require("../../utils/token");

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const result = await authService.registerService({
    name,
    email,
    password,
    role,
  });

  const accessToken = signAccessToken(result.user);
  const refreshToken = signRefreshToken(result.user);

  await RefreshTokenModel.create({
    user: result.user._id,
    tokenHash: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie(
    "accessToken",
    accessToken,
    accessCookieOptions
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    refreshCookieOptions
  );

  res.status(201).json(
    apiResponse(
      201,
      {
        data: result.user,
        accessToken,
        refreshToken,
      },
      "User created successfully"
    )
  );
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginService({
    email,
    password,
  });

  const accessToken = signAccessToken(result.user);
  const refreshToken = signRefreshToken(result.user);

  await RefreshTokenModel.create({
    user: result.user._id,
    tokenHash: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie(
    "accessToken",
    accessToken,
    accessCookieOptions
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    refreshCookieOptions
  );

  res.status(200).json(
    apiResponse(
      200,
      {
        data: result.user,
        accessToken,
        refreshToken,
      },
      "User login successfully"
    )
  );
});

const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json(
      apiResponse(401, null, "Refresh token required")
    );
  }

  const decoded = verifyRefreshToken(refreshToken);

  const storedToken = await RefreshTokenModel.findOne({
    tokenHash: refreshToken,
    user: decoded.sub,
  });

  if (!storedToken) {
    return res.status(401).json(
      apiResponse(401, null, "Invalid refresh token")
    );
  }

  const user = await require("../../models/user.model")
    .findById(decoded.sub)
    .select("-password");

  if (!user) {
    return res.status(401).json(
      apiResponse(401, null, "User not found")
    );
  }

  const newAccessToken = signAccessToken(user);

  res.cookie(
    "accessToken",
    newAccessToken,
    accessCookieOptions
  );

  return res.status(200).json(
    apiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "Access token refreshed successfully"
    )
  );
});

const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logoutService(refreshToken);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json(
    apiResponse(
      200,
      null,
      "User logout successfully"
    )
  );
});

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
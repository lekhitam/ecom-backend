const { verifyAccessToken } = require("../utils/token");
const apiError = require("../utils/appiError");

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw apiError(401, "Authentication required");
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(apiError(403, "Admin access required"));
  }

  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
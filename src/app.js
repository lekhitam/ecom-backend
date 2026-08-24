const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const apiResponse = require("./utils/apiResponse");

const authRouter = require("./modules/auth/auth.route");
const userRouter = require("./modules/users/user.route");

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Cookies
app.use(cookieParser());

// Compression
app.use(compression());

// Logger
app.use(morgan("dev"));

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
);

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json(
    apiResponse(
      200,
      {
        service: "ecom-backend",
        env: process.env.NODE_ENV || "development",
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      "API is running"
    )
  );
});

// 7.1 Authentication APIs
app.use("/api/v1/auth", authRouter);

// 7.2 Users & Addresses APIs
app.use("/api/v1/users", userRouter);

module.exports = app;
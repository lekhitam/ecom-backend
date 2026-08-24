const express = require("express");
const authController = require("./authcontroller");

const authRouter = express.Router();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.post("/refresh", authController.refreshController);
authRouter.post("/logout", authController.logoutController);

module.exports = authRouter;
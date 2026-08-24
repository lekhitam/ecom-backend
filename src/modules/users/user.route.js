const express = require("express");

const userController = require("./user.controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

// Logged-in user's profile
router.get(
  "/me",
  authMiddleware,
  userController.getMyProfile
);

router.patch(
  "/me",
  authMiddleware,
  userController.updateMyProfile
);

// Logged-in user's addresses
router.get(
  "/me/addresses",
  authMiddleware,
  userController.getAddresses
);

router.post(
  "/me/addresses",
  authMiddleware,
  userController.addAddress
);

router.patch(
  "/me/addresses/:addrId",
  authMiddleware,
  userController.updateAddress
);

router.delete(
  "/me/addresses/:addrId",
  authMiddleware,
  userController.deleteAddress
);

// Admin users
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  userController.updateUserStatus
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
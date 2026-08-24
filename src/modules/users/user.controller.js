const asyncHandler = require("../../utils/asynchandeler");
const apiResponse = require("../../utils/apiResponse");
const userService = require("./user.service");

const getMyProfile = asyncHandler(async (req, res) => {
  const result = await userService.getMyProfile(req.user.id);

  res.status(200).json(
    apiResponse(200, result, "Profile fetched successfully")
  );
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const result = await userService.updateMyProfile(
    req.user.id,
    req.body
  );

  res.status(200).json(
    apiResponse(200, result, "Profile updated successfully")
  );
});

const getAddresses = asyncHandler(async (req, res) => {
  const result = await userService.getAddresses(req.user.id);

  res.status(200).json(
    apiResponse(200, result, "Addresses fetched successfully")
  );
});

const addAddress = asyncHandler(async (req, res) => {
  const result = await userService.addAddress(
    req.user.id,
    req.body
  );

  res.status(201).json(
    apiResponse(201, result, "Address added successfully")
  );
});

const updateAddress = asyncHandler(async (req, res) => {
  const result = await userService.updateAddress(
    req.user.id,
    req.params.addrId,
    req.body
  );

  res.status(200).json(
    apiResponse(200, result, "Address updated successfully")
  );
});

const deleteAddress = asyncHandler(async (req, res) => {
  const result = await userService.deleteAddress(
    req.user.id,
    req.params.addrId
  );

  res.status(200).json(
    apiResponse(200, result, "Address deleted successfully")
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  res.status(200).json(
    apiResponse(200, result, "Users fetched successfully")
  );
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const result = await userService.updateUserStatus(
    req.params.id,
    req.body.isActive
  );

  res.status(200).json(
    apiResponse(200, result, "User status updated successfully")
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);

  res.status(200).json(
    apiResponse(200, result, "User deleted successfully")
  );
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};
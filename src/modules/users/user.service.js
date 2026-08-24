const UserModel = require("../../models/user.model");
const apiError = require("../../utils/appiError");

const getMyProfile = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw apiError(404, "User not found");
  }

  return user;
};

const updateMyProfile = async (userId, data) => {
  const allowedFields = ["name", "phone", "avatar"];

  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw apiError(404, "User not found");
  }

  return user;
};

const getAddresses = async (userId) => {
  const user = await UserModel.findById(userId).select("addresses");

  if (!user) {
    throw apiError(404, "User not found");
  }

  return user.addresses;
};

const addAddress = async (userId, addressData) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  const address = {
    ...addressData,
  };

  // First address automatically becomes default
  if (user.addresses.length === 0) {
    address.isDefault = true;
  }

  // If this address is default, remove default from others
  if (address.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  user.addresses.push(address);

  await user.save();

  return user.addresses[user.addresses.length - 1];
};

const updateAddress = async (userId, addressId, addressData) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw apiError(404, "Address not found");
  }

  const allowedFields = [
    "label",
    "fullName",
    "phone",
    "line1",
    "line2",
    "city",
    "state",
    "pincode",
    "isDefault",
  ];

  for (const field of allowedFields) {
    if (addressData[field] !== undefined) {
      address[field] = addressData[field];
    }
  }

  if (addressData.isDefault === true) {
    user.addresses.forEach((item) => {
      if (String(item._id) !== String(addressId)) {
        item.isDefault = false;
      }
    });
  }

  await user.save();

  return address;
};

const deleteAddress = async (userId, addressId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw apiError(404, "Address not found");
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  // If default address was deleted, make first remaining address default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return null;
};

const getAllUsers = async (query) => {
  const {
    search = "",
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),

    UserModel.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const updateUserStatus = async (userId, isActive) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { isActive: Boolean(isActive) } },
    { new: true }
  ).select("-password");

  if (!user) {
    throw apiError(404, "User not found");
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  return null;
};

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
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 50,
        required: true
    },

    email: {
        type: String,
        minLength: 8,
        maxLength: 16,
        unique: true,
        lowercase: true,
        required: true, 
    },

    password: {
        type: String,
        required: true,
        maxLength: 128,
    },

    phone: {
        type: String,
        maxLength: 10,
    },

    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
        index: true,
    },
    profilephoto: {
        type: String,
    },

    addresses: [{
        label: {
            type: String,
        }
    }],

    passwordSalt: {
        type: String,
        required: true,
        select: false
    }
});

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validate = require("mongoose-validator");

// Define a phone number validator
const phoneValidator = [
    validate({
        validator: "matches",
        arguments: /^[0-9]{10}$/, // You can customize the regex as needed
        message: "Invalid phone number format, it should be 10 digits long.",
    }),
];

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: phoneValidator, // Apply the phone number validator
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role:{
        type: String,
        required: true
}

});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.pre("save", async function(next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

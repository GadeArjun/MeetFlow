const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../model/User");
const { cloudinary } = require("../config/cloudinary");

// You can store this in .env
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = "1d";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (err) {
    console.error({ err });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      user: user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you set req.user from auth middleware
    const { name, username, bio, avatarUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, bio, avatarUrl },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

exports.logout = async (req, res) => {
  // For JWT-based auth, logout is typically handled on the client by deleting the token.
  res.status(200).json({ message: "Logout successful" });
};

exports.sendResetPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 15; // 15 mins

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(expires);
  await user.save();

  // Send token via email in production
  res.status(200).json({ message: "Reset link sent", token });
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update email
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password
    if (newPassword && newPassword.length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({ message: "Account updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleSendEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.sendEmail = !user.sendEmail;
    await user.save();
    res.status(200).json({ sendEmail: user.sendEmail });
  } catch (err) {
    res.status(500).json({ message: "Error toggling email setting" });
  }
};

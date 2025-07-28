const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../model/User");

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
    const { name, avatarUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatarUrl },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
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
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Password reset successful" });
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

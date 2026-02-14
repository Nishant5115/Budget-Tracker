const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

// Initialize Resend with API key
let resend;
// Use Resend's test domain for development
// For production, verify your domain at https://resend.com/domains
const FROM_EMAIL = "onboarding@resend.dev";

const initializeResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ WARNING: RESEND_API_KEY not configured in environment variables");
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

// Initialize on app start
resend = initializeResend();

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Basic password strength check
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter and one number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    // Validate email configuration
    if (!resend) {
      console.error("❌ Resend API not configured. Check RESEND_API_KEY environment variable.");
      return res.status(500).json({ 
        message: "Email service is not configured. Please contact administrator.",
        details: "RESEND_API_KEY not set"
      });
    }

    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.warn(`⚠️ User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const generatedOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = generatedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 

    await user.save();

    // Send OTP to user's registered email with error handling
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Your Budget Tracker OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
              <h2 style="margin: 0;">Budget Tracker Login</h2>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
              <p>Hi ${user.name},</p>
              
              <p>Your OTP for login is:</p>
              
              <div style="background: white; padding: 20px; border: 2px solid #3b82f6; border-radius: 10px; text-align: center; margin: 20px 0;">
                <h1 style="color: #3b82f6; letter-spacing: 5px; margin: 0;">${generatedOtp}</h1>
              </div>
              
              <p><strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>.</p>
              <p>Do not share this OTP with anyone.</p>
              
              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        `,
      });

      console.log(`✅ OTP sent successfully to: ${user.email}`);
      console.log(`📧 Resend response:`, result);

      res.json({ 
        message: "OTP sent successfully",
        email: user.email,
        expiresIn: "10 minutes"
      });

    } catch (emailError) {
      console.error(`❌ Failed to send OTP to ${user.email}:`, {
        error: emailError.message,
      });

      return res.status(500).json({ 
        message: "Failed to send OTP email",
        error: emailError.message,
      });
    }

  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid OTP request" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== String(otp)) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
};

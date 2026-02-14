const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(`🔍 Token decoded, looking for user with ID: ${decoded.id}`);

      // Get user from database
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists
      if (!req.user) {
        console.error(`❌ User not found in database. User ID from token: ${decoded.id}`);
        return res.status(401).json({ 
          message: "User not found with this token",
          details: "The user associated with this token no longer exists. Please login again.",
          userId: decoded.id
        });
      }

      console.log(`✅ User authenticated: ${req.user.email}`);
      next();
    } catch (error) {
      console.error("❌ Authentication error:", error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: "Invalid token",
          error: error.message 
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Token expired",
          error: error.message 
        });
      }
      return res.status(401).json({ 
        message: "Not authorized, token failed", 
        error: error.message 
      });
    }
  } else {
    // No token provided
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };module.exports = { protect };

const express = require("express");
const router = express.Router();

const { getMe, updateMe, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


router.get("/me", protect, getMe);

router.put("/me", protect, updateMe);

router.post("/change-password", protect, changePassword);

module.exports = router;






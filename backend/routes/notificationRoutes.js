const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const {
  getNotifications,
  markNotificationRead,
  markAllRead,
} = require("../controllers/adminController");

router.use(userAuth);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllRead);

module.exports = router;

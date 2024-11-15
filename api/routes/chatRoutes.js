const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/authtoken");

router.get("/users", userController.getUsers);
router.get("/profile", authenticateToken, userController.profile);

router.post("/users", userController.createUser);
router.post('/login' ,authController.login);

module.exports = router;

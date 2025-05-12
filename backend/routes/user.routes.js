const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.put('/users/profile', UserController.updateUser);

module.exports = router;

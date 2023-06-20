const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../schemas/user.js");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    res
      .status(400)
      .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요" });
    return;
  }
  const token = jwt.sign({ userId: user.userId }, "customzied-secret-key");

  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;

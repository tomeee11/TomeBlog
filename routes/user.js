const express = require("express");
const router = express.Router();

const User = require("../schemas/user.js");

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  const nicknameRegex = /^[a-z0-9_-]{3,}$/;


  if( !nicknameRegex.test(nickname) ){
    res.status(400).json({
        errorMessage : "최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)를 입력해주세요."
    })
    return;
  }

  if(!(password >=4 && nickname !== password)){
    res.status(401).json({
        errorMessage: "비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함되어서는 안됩니다."
    })
    return ;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).json({ message:"회원가입되었습니다."});
});


module.exports = router;
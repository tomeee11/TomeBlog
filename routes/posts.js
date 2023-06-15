// express에서 제공되는 Router 함수를 사용해 Router를 생성합니다.
const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const { default: mongoose } = require("mongoose");



// const posts = [
//   {
//     postsId: "62d6d12cd88cadd496a9e54e",
//     user: "Developer",
//     title: "안녕하세요",
//     createdAt: "2022-07-19T15:43:40.266Z",
//   },
//   {
//     postsId: "62d6cc66e28b7aff02e82954",
//     user: "Developer",
//     title: "안녕하세요",
//     createdAt: "2022-07-19T15:23:18.433Z",
//   },
// ];

// localhost:3000/api/ GET


router.get("/", (req, res) => {
  res.send("default url for posts.js GET Method");
});

// localhost:3000/api/about GET
router.get("/about", (req, res) => {
  res.send("posts.js about PATH");
});


// posts 조회
router.get("/posts", (req, res) => {
  const posts = Posts.find({})
  
  console.log(posts)


  res.json({});
});


// posts 상세조회
router.get("/posts/:_postId", (req, res) => {
  const { _postId } = req.params;
  const [result] = posts.filter((post) => _postId === post.postsId);

  res.json({ data: result });
});

//posts 정보 입력

router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!(user && password && title && content)) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const createdPosts = await Posts.create({
    user,
    password,
    title,
    content,
  });

  res.status(201).json({ message: "게시글을 생성하였습니다." });
});

// Router를 app.js에서 사용하기 위해 하단에 내보내주는 코드
module.exports = router;

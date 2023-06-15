// express에서 제공되는 Router 함수를 사용해 Router를 생성합니다.
const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const { default: mongoose } = require("mongoose");

// localhost:3000/api/ GET
router.get("/", (req, res) => {
  res.send("default url for posts.js GET Method");
});

// localhost:3000/api/about GET
router.get("/about", (req, res) => {
  res.send("posts.js about PATH");
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

// 전체 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.find();
  res.json({ data: posts });
});

// posts 상세조회
router.get("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const posts = await Posts.findOne({ _id: `${_postId}` });
    res.status(200).json({ data: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// posts 수정
router.put("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, password, title, content } = req.body;
    const post = await Posts.findOne({ _id: _postId });
    if (!(user && password && title && content)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (post.password === password) {
      await Posts.updateOne(
        { _id: _postId },
        { $set: { user, title, content } }
      );
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

//posts 삭제
router.delete("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, password, title, content } = req.body;
    const post = await Posts.findOne({ _id: _postId });

    if (!(user && password && title && content)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (post.password === password) {
      await Posts.deleteOne({ _id: _postId }, { $set: { password } });
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

// Router를 app.js에서 사용하기 위해 하단에 내보내주는 코드
module.exports = router;

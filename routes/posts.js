// express에서 제공되는 Router 함수를 사용해 Router를 생성합니다.
const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const createdAt = new Date()


//posts 정보 입력
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!(user && password && title && content)) {
    return res.status(400).json({Message: "데이터 형식이 올바르지 않습니다.",});
  }
  const createdPosts = await Posts.create({
    user,
    password,
    title,
    content,
    createdAt,
  });

  res.status(201).json({ message: "게시글을 생성하였습니다." });
});

// 전체 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.find();
  const results = posts.map((a)=>{return{
    postId:a._id,
    user:a.user,
    title:a.title,
    createdAt:createdAt
  }})
  res.json({ data: results });
});

// posts 상세조회
router.get("/posts/:_postId", async (req, res) => {
  try {
    const postId = req.params._postId;
    const posts = await Posts.findOne({ _id: postId });
    res.status(200).json({ data: {
      postId:postId,
      user:posts.user,
      title:posts.title,
      content:posts.content,
      createdAt:createdAt
    } });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// posts 수정
router.put("/posts/:_postId", async (req, res) => {
  try {
    const postId = req.params._postId;
    const { user, password, title, content } = req.body;
    const post = await Posts.findOne({ _id: postId });
    if (!(user && password && title && content)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (post.password === password) {
      await Posts.updateOne(
        { _id: postId },
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
    const postId = req.params._postId;
    const { user, password, title, content } = req.body;
    const post = await Posts.findOne({ _id: postId });

    if (!(user && password && title && content)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (post.password === password) {
      await Posts.deleteOne({ _id: postId }, { $set: { password } });
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

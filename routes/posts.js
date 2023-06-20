// express에서 제공되는 Router 함수를 사용해 Router를 생성합니다.
const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const Users = require("../schemas/user.js");
const loginMiddleware = require("../middlewares/login-middleware.js");

//posts 정보 입력
router.post("/posts", loginMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = res.locals.user._conditions._id;
    const users = await Users.findOne({ _id: userId });
    const nickname = users.nickname;
    if (!(title && content)) {
      res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!title) {
      res
        .status(412)
        .json({ errorMessage: "게시글의 제목의 형식이 올바르지 않습니다." });
    }
    if (!content) {
      res
        .status(412)
        .json({ errorMessage: "게시글의 내용의 형식이 올바르지 않습니다." });
    }
    await Posts.create({
      userId,
      nickname,
      title,
      content,
    });

    res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 전체 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.find({});
    const results = posts.map((a) => {
      return {
        postId: a._id,
        userId: a.userId,
        nickname: a.nickname,
        title: a.title,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
    res.json({ posts: results });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// posts 상세조회
router.get("/posts/:_postId", async (req, res) => {
  try {
    const postId = req.params._postId;
    const posts = await Posts.findOne({ _id: postId });
    res.status(200).json({
      post: {
        postId: postId,
        userId: posts.userId,
        nickname: posts.nickname,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// posts 수정
router.put("/posts/:_postId", loginMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user._conditions._id;
    const postId = req.params._postId;
    const { title, content } = req.body;
    const post = await Posts.findOne({ _id: postId });
    if (!(title && content)) {
      res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다" });
    }
    if (!title) {
      res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다" });
    }
    if (!content) {
      res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다" });
    }
    if (post.userId !== userId) {
      res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    if (post.userId === userId) {
      await Posts.updateOne({ _id: postId }, { $set: { title, content } });
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } else {
      res
        .status(401)
        .json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ errorMessage: "게시글 수정에 실패하였습니다" });
  }
});

//posts 삭제
router.delete("/posts/:_postId", loginMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user._conditions._id;
    const postId = req.params._postId;
    const post = await Posts.findOne({ _id: postId });
    if (!postId){
      res.status(404).json({errorMessage:"게시글이 존재하지 않습니다."})
    }
    if (post.userId !== userId) {
      res
        .status(401)
        .json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다" });
    }
    if (post.userId === userId) {
      await Posts.deleteOne({ _id: postId });
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      res
        .status(401)
        .json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패하였습니다" });
  }
});

// Router를 app.js에서 사용하기 위해 하단에 내보내주는 코드
module.exports = router;

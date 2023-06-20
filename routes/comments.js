const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comments.js");
const Users = require("../schemas/user.js");
const loginMiddleware = require("../middlewares/login-middleware.js");

// 정보 입력
router.post("/posts/:_postId/comments", loginMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user._conditions._id;
    const postId = req.params._postId;
    const { comment } = req.body;
    const users = await Users.findOne({ _id: userId });
    const nickname = users.nickname;
    if (!postId) {
      return res.status(400).json({ Message: "게시글이 존재하지 않습니다." });
    }
    if (!comment) {
      res.status(412).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
    }
    await Comments.create({
      postId,
      userId,
      nickname,
      comment,
    });

    res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

// 정보조회
router.get("/posts/:_postId/comments", async (req, res) => {
  try {
    const postId = req.params._postId;
    const comments = await Comments.find({ postId });
    const results = comments.map((a) => {
      return {
        commentId: a._id,
        userId: a.userId,
        nickname: a.nickname,
        comment: a.comment,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
    if (!postId) {
      res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다" });
    }
    res.status(201).json({ comments: results });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

// 수정
router.put(
  "/posts/:_postId/comments/:_commentId",
  loginMiddleware,
  async (req, res) => {
    try {
      const userId = res.locals.user._conditions._id;
      const postId = req.params._postId;
      const commentId = req.params._commentId;
      const { comment } = req.body;
      const comments = await Comments.findOne({ _id: commentId });
      if (!postId) {
        res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      }
      if (!userId) {
        res
          .status(404)
          .json({ errorMessage: "댓글 수정 권한이 존재하지 않습니다." });
      }
      if (!comment) {
        res
          .status(412)
          .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      }
      if (!commentId) {
        res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다" });
      }
      if (comments.postId === postId) {
        await Comments.updateOne({ _id: commentId }, { $set: { comment } });
        res.status(200).json({ message: "댓글을 수정하였습니다." });
      } else {
        res
          .status(400)
          .json({
            errorMessage: "댓글 수정이 정삭적으로 처리되지 않았습니다.",
          });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: "댓글 수정에 실패하였습니다." });
    }
  }
);

// 삭제
router.delete(
  "/posts/:_postId/comments/:_commentId",
  loginMiddleware,
  async (req, res) => {
    try {
      const userId = res.locals.user._conditions._id;
      const commentId = req.params._commentId;
      const postId = req.params._postId;
      const comment = await Comments.findOne({ _id: commentId });
      if (!postId) {
        res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      }
      if (!userId) {
        res
          .status(403)
          .json({ errorMessage: "댓글의 삭제 권한이 존재하지 않습니다." });
      }
      if (!commentId) {
        res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
      }
      if (comment.postId === postId) {
        await Comments.deleteOne({ _id: commentId });
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
      } else {
        res
          .status(401)
          .json({
            errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다.",
          });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    }
  }
);

module.exports = router;

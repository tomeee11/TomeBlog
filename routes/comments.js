const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comments.js");
const createdAt = new Date()

// 정보 입력
router.post("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const { user, password, content } = req.body;
  
  if (!postId) {
    return res
      .status(400)
      .json({ Message: "데이터 형식이 올바르지 않습니다." });
  }
  if (!content){
    return res
      .status(400)
      .json({ Message: "댓글 내용을 입력해주세요." });
  }
  const createdComments = await Comments.create({
    postId,
    user,
    password,
    content,
    createdAt,
  });

  res.status(201).json({ message: "댓글을 생성하였습니다." });
});

// 정보조회
router.get("/comments/:_postId", async (req, res) => {
  try{
  const postId = req.params._postId;
  const comments = await Comments.find({postId});
  const comment = comments.map((data)=>data.postId === postId )
  const results = comments.map((a)=>{return{
    commentId:a._id,
    user:a.user,
    content:a.content,
    createdAt:createdAt
  }})
  if(comment){
    res.json({data:results});
  }}
  catch (error) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});

// 수정
router.put("/comments/:_commentId", async (req, res) => {
  try {
    const commentId = req.params._commentId;
    const {  password, content } = req.body;
    const comment = await Comments.findOne({ _id:commentId });
    if (!( password &&  content)) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (comment.password === password) {
      await Comments.updateOne(
        { _id: commentId },
        { $set: { content:content } }
      );
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

// 삭제
router.delete("/comments/:_commentId", async (req, res) => {
  try {
    const commentId = req.params._commentId;
    const {password} = req.body;
    const comment = await Comments.findOne({ _id: commentId });

    if (!password) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    if (comment.password === password) {
      await Comments.deleteOne({ _id: commentId }, { $set: { password } });
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다" });
  }
});

module.exports = router;

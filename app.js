// 웹 서버 코드 locallhost:3000
const express = require("express");
const app = express();
const port = 3000;
// 몽고디비 연결 
const connect = require("./schemas")
connect()

// // Router 미들웨어를 사용하겠다고 작성합니다 (미들웨어를 없이 body로 전달 받은 JSON 데이터는 바로 사용할 수 없다)
const postsRouter = require("./routes/posts.js");
const CommentsRouter = require("./routes/comments.js");
app.use(express.json());
// localhost:3000/api -> Router
app.use("/", [postsRouter,CommentsRouter]);




//포트 연결시 node app.js ->  "포트로 서버가 열렸어요!"
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});



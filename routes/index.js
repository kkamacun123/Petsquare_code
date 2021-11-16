const express = require('express');
const models = require('../models');
const router = express.Router();

// 게시글 목록
router.get('/board', async function(req, res, next) {
  let result = await models.post.findAll();
  if (result){
    for(let post of result){
      let result2 = await models.post.findOne({
        include: {
          model: models.reply,
          where: {
            postId: post.id
          }
        }
      })
      if(result2){
        post.replies = result2.replies
      }
    } 
  }
  res.render("show", {
    posts : result
  });
});
// 게시글 등록
router.post('/board', function(req, res, next) {
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
  .then( result => {
    console.log("데이터 추가 완료");
    res.redirect("/show");
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});

// 게시글 조회
router.get('/board/:id', function(req, res, next) {
  let postID = req.params.id;

  models.post.findOne({
    where: {id: postID}
  })
  .then( result => {
    res.render("edit", {
      post: result
    });
  })
  .catch( err => {
    console.log("데이터 조회 실패");
  });
});

// 게시글 수정
router.put('/board/:id', function(req, res, next) {
  let  postID = req.params.id;
  let body = req.body;

  models.post.update({
    title: body.editTitle,
    writer: body.editWriter
  },{
    where: {id: postID}
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.redirect("/board");
  })
  .catch( err => {
    console.log("데이터 수정 실패");
  });
});

// 게시글 삭제
router.delete('/board/:id', function(req, res, next) {
  let postID = req.params.id;

  models.post.destroy({
    where: {id: postID}
  })
  .then( result => {
    res.redirect("/board")
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

// 댓글 등록
router.post("/reply/:postID", function(req, res, next){
  let postID = req.params.postID;
  let body = req.body;

  models.reply.create({
    postId: postID,
    writer: body.replyWriter,
    content: body.replyContent
  })
  .then( results => {
    res.redirect("/board");
  })
  .catch( err => {
    console.log(err);
  });
});

module.exports = router;
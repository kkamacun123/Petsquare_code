var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser');
var async = require('async');

const client = mysql.createConnection({
  user : 'root',
  password : 'jinjin',
  database : 'client' //client 는 스키마 이름(데베 이름)
});
router.use(bodyParser.urlencoded({ extended: false }))


router.get("/pasing/:cur", function (req, res) {
  
  if(req.session.is_logined == true){
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    var queryString = 'select count(*) as cnt from a_post'
    
    
    getConnection().query(queryString, function (error2, data) {
        if (error2) {
        console.log(error2 + "메인 화면 mysql 조회 실패");
        return
        }
        //전체 게시물의 숫자
        totalPageCount = data[0].cnt
        
        //현제 페이지
        var curPage = req.params.cur;
        console.log("현재 페이지 : " + curPage, "전체 게시물 : " + totalPageCount);
        
        //전체 페이지 갯수
        if (totalPageCount < 0) {
        totalPageCount = 0
        }
        
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지
        
        //현재페이지가 0 보다 작으면
        if (curPage < 0) {
        no = 0
        } else {
        //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
        no = (curPage - 1) * 10
        }
    
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
            }; 
        
        fs.readFile('list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
                }
        
                var queryString = 'select user,title,contents,user from a_post order by id desc limit ?,?'; //limit 가 뭐지?
                getConnection().query(queryString, [no, page_size], function (error, result) {
                  
                if (error) {
                console.log("페이징 에러" + error);
                return
                }
                res.send(ejs.render(data, {
                  
                data: result,
                pasing: result2
                }));
                
                });
                });
                
                
                })
                
              }
            else{
              res.write("<script>alert('Login is needed!'); location=\"../views/login\"</script>");
            }})
                
        //메인화면
        router.get("/main", function (req, res) {
        console.log("메인화면")
        
        //main 으로 들어오면 바로 페이징 처리
        res.redirect('/pasing/' + 1)
    
        });
        //삭제
        
        //삽입 페이지
        router.get("/insert", function (req, res) {
        
        console.log("삽입 페이지 나와라")
        
        fs.readFile('insert.ejs', 'utf-8', function (error, data) {
           
        res.send((ejs.render(data,{
          user : req.session.id
        })))
        })}
        
    
        )
        //삽입 포스터 데이터
        router.post("/insert",  function (req, res) {
        console.log("삽입 포스트 데이터 진행")
        var body = req.body;
        var ID = number;
        var User = globalId;
        getConnection().query('insert into a_post(id, user,title,contents) values (?, ?,?,?)', 
        [ID,User,body.title,body.contents], 
        function () {
        //응답
        
        res.redirect('/main');
        })
       
      })
        router.get("/delete/:id",function (req, res) {
          
          
          client.query('select * from a_post where id= ?', [req.params.id], (err,data)=>{
            if(globalId == data[0].user){
              client.query('delete from a_post where id=?', [req.params.id]
              
            )
            res.redirect('/main')}
            else{
              res.write("<script>alert('Authorization cancelled'); location=\"/main\"</script>")
          }})
      
          })
        
        //수정 페이지
        router.get("/edit/:id", function (req, res) {
        console.log("수정 진행")
    
        fs.readFile('edit.ejs', 'utf-8', function (error, data) {
        client.query('select * from a_post where id = ?', [req.params.id], function(err, result){
          if(globalId == result[0].user){
            res.send(ejs.render(data,{
              data : result[0]
            } ))
          }
          else{
            res.write("<script>alert('Authorization cancelled'); location=\"/main\"</script>")
          }
        }
      )
        });
    
        })
        //수정 포스터 데이터
        router.post("/edit/:id", function (req, res) {
        console.log("수정 포스트 진행")
        var Id = req.params.id
        console.log(Id)
        var body = req.body;
        console.log(body);
        var queryupdate = `update a_post set title=?, contents=? where id=${Id}`;
        getConnection().query(queryupdate,
        [body.title, body.contents], function () {
        res.redirect('/main')
        })
        })
    
        //글상세보기
        router.get("/detail/:id", function (req, res) {
        console.log("상세보기 진행")
    /*
        var return_data = {
        
        };
        
        async.parallel([
           function(parallel_done) {
            getConnection().query('select * from a_post where id=?', [req.params.id], function(err, results) {
                   if (err) return parallel_done(err);
                   return_data.table1 = results;
                   
                   parallel_done();
               });
           },
           function(parallel_done) {
            getConnection().query('select ID,id_post,par_comment from Comment where id_post = ?', [req.params.id],function(err, results) {
                   if (err) return parallel_done(err);
                   return_data.table2  = results;
                   parallel_done();
               });
           }
        ], function(err) {
          
             if (err) console.log(err);
             fs.readFile('detail.ejs', 'utf-8', function(error, results){
              var info = return_data.table1[0];
              
              res.send(ejs.render(info,{
                
              }))
             })
             
          });
        }
        */
        
             
       
        
        fs.readFile('detail.ejs', 'utf-8', function (error, data1) {
          
          
        getConnection().query('select * from a_post where id = ?', [req.params.id], function (error, result) {
        res.send(ejs.render(data1, {
        data1: result[0]
        }))
        })
       
        })
        
         
        
        
      }
        )
        
        
   
       /*router.post("detail/:id", function(error, data){
        var addComment = function(req,res){
          console.log('post.js의 addcomment 호출됨');}})
          /*
          var paramId = req.body.id || req.query.id; // 댓글말고 본 글의 아이디
          var paramComments = req.body.commentText || req.query.commentText; //  댓글 내용
          var paramWriter = req.body.writer || req.query.writer;
      
          console.log('parameter : ' + paramId + ', ' + paramComments + ', ' + paramWriter);
      
          getConnection().query('select * from board where name = ?', [req.params.name], {
              database.postModel.findByIdAndUpdate(paramId, {$push :{comments:{contents:paramComments, writer: paramWriter}}}, function(err){
                  if(err){
                      console.log('댓글 추가 중 에러 발생 : ' +err.stack);
      
                      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                      res.write('<h2>게시판 댓글 추가 중 에러 발생</h2>');
                      res.end();
                      
                      return;           
                  }
                  
                  console.log('댓글 추가 완료 ');
                  
                  return res.redirect('/process/showpost/' + paramId);
              });
              
              
          } else {
              res.writeHead('200', {
                  'Content-Type': 'text/html;charset=utf8'
              });
              res.write('<h2>데이터베이스 연결 실패</h2>');
              res.end();
          }





        getConnection().query('select * from board where name = ?', [req.params.name], function (error, result) {
          res.send(ejs.render(data, {
          data: result[0]
          }))
          })
          

       })


*/
        var pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            database: 'client',
            password: 'jinjin'
            })
            
            
          
        function getConnection() {
            return pool
            }
            
            
            
            
            module.exports = router
            
            
    

    
    
    
    
    
    
    
    
    
    
    
                
                
            
    







/*var template = require('../template/tp_게시판.js');

module.exports = {
    HTML:function(title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
  }
  */
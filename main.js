const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');
const html = require('html')
var sanitizeHtml = require('sanitize-html');

global.globalId = {};
global.number = {};


// express 설정 1
const app = express();



app.get('/page', function(req, res) { 
    return res.send('/page');
});



// db 연결 2
const client = mysql.createConnection({
    user : 'root',
    password : 'jinjin',
    database : 'client' //client 는 스키마 이름(데베 이름)
});

// 정적 파일 설정 (미들웨어) 3
app.use(express.static(__dirname + "/views"));
//이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하려면 Express의 기본 제공 미들웨어 함수인 express.static을 사용해야 한다. 
//static의 인자로 전달되는 'public'은 디렉터리의 이름입니다. 따라서 'public' 이라는 디렉터리 밑에 있는 데이터들은 웹브라우저의 요청에 따라 서비스를 제공해줄 수 있습니다.
//가령, 사용자가 127.0.0.1:3000/images/cat.jpg 로 접근한다면, 해당 파일을 public/images/cat.jpg에 존재하는지 검색하게 됩니다.
//__dirname : 현재 위치를 가리키는 node 전역변수
//const getPath = path.join('/doc','maybe','a','//////docdoc//','join')
//console.log(getPath) //출력 : /doc/maybe/a/docdoc/join


// ejs 설정 4
//EJS는 Script 태그를 html 내부에서 적용하여 활용할 수 있는 웹 애플리케이션 템플릿 언어이다. 이를 활용하여 서버 사이드 애플리케이션을 개발하고 빠른 테스트를 수행하거나, JSP, HTML로 표현 가능한 View를 표출할 수 있도록 도와준다.
//nodejs에서 뷰 템플릿은 프로젝트 디렉토리 내에 view 디렉토리를 생성해서 따로 관리한다

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
//app.set('view engine', 'ejs') 라인은 viewengine으로 ejs를 쓰겠다는 선언이다
//view 파일들을 모아놓는 디렉토리가 바로 views 디렉토리
//app.set('views', __dirname + '/views'); view engine이 사용할 템플릿, 실제 view 파일이 어딨는지 지정하는 명령

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({extended:false}));
//가지고 있는 데이터를 내가 원하는 형태의 데이터로 ‘가공'하는 과정을 parsing 이라 하며 그 과정을 수행하는 모듈 혹은 메소드를 parser 라 일컫는다.
//express 문서에 따르면 미들웨어 없이req.body 에 접근하는 경우에는 기본으로undefined 가 설정되어 있으므로 bodyParser, multer와 같은 미들웨어를 사용하여 요청 데이터 값에 접근해야 한다
//bodyParser 미들웨어의 여러 옵션 중에 하나로 false 값일 시 node.js에 기본으로 내장된 queryString, true 값일 시 따로 설치가 필요한 npm qs 라이브러리를 사용한다.
//body parser 미들웨어 : POST 요청 데이터를 추출합니다.


// 세션 (미들웨어) 6
app.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요할 때 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore()
    // 세션이 데이터를 저장하는 곳
}));
var boardRouter = require('./data/게시판.js');
const { Script } = require('vm');
app.use(boardRouter)


// 메인페이지
//app.use 는  global middleware를 만들 수 있게 한다. 즉 어느 URL에도 작동하는 미들웨어!
//미들웨어를 use 하는 게 먼저고 그다음에 URL의 get이 와야한다.
app.get('/', (req,res)=>{    //"/"에 get요청이 왔을 때
    console.log('메인페이지 작동');
    console.log(req.session);
    
    if(req.session.is_logined == true){
        client.query('select max(id) from a_post;', function (err, result, fields){
            
            if(result){
                number = 1;
            }
            else{
                number = result[0] +1;
            }
        
        res.render("cappet", {is_logined : req.session.is_logined, 
          id : req.session.id})//,{ // index.ejs, res.render : 설정된 템플릿 엔진을 사용해 views를 렌더링한다
         //is_logined : req.session.is_logined,
           // name : req.session.name
       //});//
        })
    }else{
        res.render("cappet", {is_logined : false})//,{//
            //is_logined : false//
        //});//
    

}})

//template의 tp_**들은 모두 index.ejs와 관려있음
/*app.get('/:pageId', function(request, response) { 
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        });
        var structure = require('./data/sanitizedTitle'); //이부분 수정필요
        var list = structure.list(filelist);
        var html = structure.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>`,
          ` <a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
      });
    });*/
 
// 회원가입
app.get('/views/register',(req,res)=>{
    console.log('회원가입 페이지');
    res.render('register');
});

app.post('/views/register',(req,res)=>{
    console.log('회원가입 하는중')
    const body = req.body;
    const id = body.id;
    const pw = body.pw;
    const name = body.name;
    
    client.query('select * from userdata where id=?',[id],(err,data)=>{//table 이름이 userdata
        if(data.length == 0){// mysql에 접속을 한 뒤 그 데이터 값(길이로 판단)이 없으면
            console.log('회원가입 성공');
            client.query('insert into userdata(id, name, pw) values(?,?,?)',[
                id, name, pw
            ]);
            res.redirect('login');
        }else{
            console.log('회원가입 실패');
            
            res.redirect('login');
        }
    });
});

app.get('/views/login',(req,res)=>{
    console.log('로그인 작동');
    res.render('login');
});

app.post('/views/login',(req,res)=>{
    const body = req.body;
    const id = body.id;
    
    const pw = body.pw;
    
    

    client.query('select * from userdata where id=?',[id],(err,data)=>{
        // 로그인 확인
        
        console.log(id);
        console.log(data[0].id);
        console.log(data[0].pw);
        console.log(id == data[0].id);
        console.log(pw == data[0].pw);
       
        if(id == data[0].id && pw == data[0].pw){
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            global.globalId = data[0].id
            console.log(globalId)
        
            
            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                res.render('cappet',{ // 정보전달
                    pw : data[0].pw,
                   id : data[0].id,
                    
                    is_logined : true
                });
                
                
            });
            console.log(req.session)
        }else{
            
            console.log('로그인 실패');
            res.redirect('login')
            
            
        }
    
})
    
});
//세션은 이러한 문제점을 고려해서, 쿠키를 업그레이드 한 것이라 보면 됩니다. 쿠키와 달리 서버에 데이터를 저장하고 웹 브라우저는 Session ID만을 가지고 있기 때문에 비교적 안전합니다.


app.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
    req.session.destroy(function(err){
        // 세션 파괴후 할 것들
        res.redirect('/');
    });

});

app.listen(3000,()=>{
    console.log('3000 port running...');
});


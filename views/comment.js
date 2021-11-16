var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser');
var async = require('async');

router.use(bodyParser.urlencoded({ extended: false }))

router.get("/comment/:id", function(req,res){
 
    fs.readFile('detail.ejs', 'utf-8', function (error, data2) {
          
          
        getConnection().query('select * from Comment where id_post = ?', [req.params.id], function (error, result) {
        res.send(ejs.render(data2, {
        data2: result[0]
        }))
        })
       
        })
})




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
    
﻿//连接数据库
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
moment.locale('zh-cn');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'forum'
});
//链接数据库
connection.connect();
var app = express();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    //这段仅仅为了方便返回json而已
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200);
    } else {
        next();
    }
});
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//创建帖子请求
app.post('/forum/post/create', function createPost(req, res) {
    var getObj = req.body;
    var postTime = moment();
    var postIdArr = [postTime.format('YYYYMMDDHHmmss'), getObj.user_id];
    var id = postIdArr.join();
    var addSql = 'INSERT INTO post(id,title, type, user_id,user_name content, view_num, reply_num,floor_num,favor_num) VALUES(?,?,?,?,?,?,?,?)';
    var addSqlParams = [
        id,
        getObj.post_title,
        getObj.post_type,
        getObj.user_id,
        getObj.user_name,
        getObj.post_content,
        0,
        0,
        0,];
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('Insert Error ', err.message);
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            console.log('Insert Success');
            res.json(
                {
                    state: 'Y', post_id: id
                });
        }
    })
})

//删除帖子请求
app.post('/forum/post/delete', function deletePost(req, res) {
    var getObj = req.body;
    var delSql = 'DELETE FROM post WHERE id = ?';
    var delSqlParams = [
        getObj.id,
        ];
    connection.query(delSql, delSqlParams, function (err, result) {
        if (err) {
            console.log('Delete Error ', err.message);
            res.json(
                {
                    state: 'N'
                });
        }
    })
    var delSql2 = 'DELETE FROM reply WHERE post_id = ?';
    connection.query(delSql2, delSqlParams, function (err, result) {
        if (err) {
            console.log('Delete Error ', err.message);
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            console.log('Delete Success');
            res.json(
                {
                    state: 'Y'
                });
        }
    })
})

//创建回复请求
app.post('/forum/reply/create', function createPost(req, res) {
    var getObj = req.body;
    var postTime = moment();
    var floor ;
    var sltSql = 'SELECT floor_num FROM post WHERE id =?';
    var sltSqlParams = [
        getObj.id
    ];
    connection.query(sltSql, sltSqlParams, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            floor = result.floor_num+1;
        }
    })
    var replyIdArr = [getObj.post_id, floor];
    var id = replyIdArr.join();
    var updSql = 'UPDATE post SET floor_num=floor_num+1,reply_num=reply_num+1';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })


    var addSql = 'INSERT INTO reply(id, post_id, user_id,user_name,level,is_reference,reference_id,content) VALUES(?,?,?,?,?,?,?,?)';
    var addSqlParams = [
        id,
        getObj.post_id,
        getObj.user_id,
        floor,
        getObj.is_reference,
        getObj.reference_id,
        getObj.content,
        ];
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('Insert Error ', err.message);
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            console.log('Insert Success');
            res.json(
                {
                    state: 'Y'
                });
        }
    })
})

//删除回复请求
app.post('/forum/reply/delete', function deletePost(req, res) {
    var getObj = req.body;
    var updSql = 'UPDATE post SET reply_num=reply_num-1';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })
    var delSql = 'DELETE FROM reply WHERE id = ? ';
    var delSqlParams = [
        getObj.id
    ];
    connection.query(delSql, delSqlParams, function (err, result) {
        if (err) {
            console.log('Delete Error ', err.message);
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            console.log('Delete Success ', err.message);
            res.json(
                {
                    state: 'Y'
                });
        }
    })
    
})


//帖子详情请求
app.post('/forum/post/detail', function postDetail(req, res) {
    var getObj = req.body;
    var postDetail = {
        state:'',
        post:'',
        replies:''
    }
    var sltSql = 'SELECT title, type, user_id, user_name, content, view_num, reply_num,floor_num, favor_num,FROM_UNIXTIME(create_date) as time_stamp FROM post WHERE id =?';
    var sltSqlParams = [
        getObj.id
       ];
    connection.query(sltSql, sltSqlParams, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
        else
        {
            postDetail.post = result;
        }
    })
    var sltSql2 = 'SELECT level, content, user_id, user_name,is_reference,reference_id, FROM_UNIXTIME(create_date) as time_stamp FROM reply WHERE post_id =?';
    
    connection.query(sltSql2, sltSqlParams, function (err, result) {
      
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
        else {
            postDetail.state = 'Y';
            postDetail.replies = result;
            res.json(postDetail);
        }
    })

})





var server = app.listen(3000,function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);

})
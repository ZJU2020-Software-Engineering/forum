//连接数据库
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: '47.100.237.232',
    user: 'root',
    password: 'root',
    database: 'forum',
    port: 3306
})

connection.connect()

app.user('/forum/user/block', function banUser(req, res)){
    var getObj = req.body;
    var updSql = 'UPDATE user SET blocked=TURE';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })

    var addSql = 'INSERT INTO blockedList(userID, startTime, endTime, reason, administrator) VALUES(?, ?, ?, ?, ?)';
    var addSqlParams = [
        userId,
        getObj.startTime,
        getObj.endTime,
        getObj.reson,
        getObj.administrator];
    connection.query(addSql, addSqlParams, function (err, result)){
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
                    state: 'Y', post_id: postId
                });
        }
    }
}

app.user('/forum/user/deblock', function banUser(req, res)){
    var getObj = req.body;
    var updSql = 'UPDATE user SET blocked=FALSE';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })
    var delSql = 'DELETE FROM blockedList WHERE userId = ?';
    var delSqlParam = [
        getObj.userId
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
            console.log('Delete Success');
            res.json(
                {
                    state: 'Y'
                });
        }
    })
}
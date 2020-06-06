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
    var updSql = 'UPDATE user SET state=1';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })

    var addSql = 'INSERT INTO blackList(id, reply_id, user_id, type, create_date, update_date) VALUES(?, ?, ?, ?, ?, ?)';
    var addSqlParams = [
        id,
        getObj.reply_id,
        getObj.user_id,
        getObj.type,
        getObj.create_date,
        getObj.update_date];
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
    var updSql = 'UPDATE user SET state=0';
    connection.query(updSql, function (err, result) {
        if (err) {
            res.json(
                {
                    state: 'N'
                });
        }
    })
    var delSql = 'DELETE FROM blackList WHERE user_id = ?';
    var delSqlParam = [
        getObj.user_id
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
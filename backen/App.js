var mysql = require('mysql')
var connection = mysql.createConnection({
    host:'47.100.237.232',
    user:'root',
    password:'root',
    database:'forum',
    port:3306
})

connection.connect()

connection.query('select * from user', function(err, rows, fields){
    if (err) throw err
    console.log(rows)
})

string = 'insert into user (username, password) values ("' + 'ccc' +'","' + 'ddd' +'")';
connection.query(string, function(err, rows, fields){
    if (err) throw err
    console.log(rows)
})


string = 'delete from user where ' + 'username' + ' = ' +'"aaa"';
connection.query(string, function(err, rows, fields){
    if (err) throw err
    console.log(rows)
})


connection.end()
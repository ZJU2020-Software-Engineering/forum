// ================ Set Route ================ //
const express = require('express')
const app = express()
const port = 3291

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/forum/post/list', async (req,res)=>{
    console.log('收到请求')
    console.log(req.body)
    let data = await getData(req.body.type,req.body.num)
    console.log(data)
    res.send(data)
})

app.post('/forum/search', async (req,res)=>{
    console.log('收到搜索请求')
    console.log(req.params)
    console.log('keywords:',req.body.num)
    let data = await searchData(req.body.num,req.body.keywords)
    console.log(data)
    res.send(data)
})


// ================ Database Connect ===================== //
const mysql = require('mysql')
const connection = mysql.createConnection({
    host:'47.100.237.232',
    user:'root',
    password:'root',
    database:'forum',
    port:3306
})

connection.connect()

connection.query('select * from post',(err,rows,fields)=>{
    console.log("All Data:",rows)
})

/*
connection.query('ALTER TABLE post ADD FULLTEXT INDEX ft_index (title,content);',(err,rows,fileds)=>{
    if(err){
        console.log("建立索引时发生错误：",err);
    }
})


let sqlForInsert = 'insert into post (title,type,user_id,content,view_num) values (?,?,?,?,?);'
let keywords = ['hello','world']
for(let i=0;i<20;i++){
    let data = {
        title:`This is ${i}th post`,
        type:Math.round(Math.random()),
        user_id:i,
        content:`it is a laji post, keyword id ${keywords[Math.round(Math.random())]}`,
        view_num:Math.floor(Math.random()*100),
    }
    connection.query(sqlForInsert,[data.title,data.type,data.user_id,data.content,data.view_num],(err,rows,fields)=>{
        if(err){
            console.log("插入时发生错误：",err);
        }
    })
}
*/

//每一次取数据取100条，预先储存
//使不用每一次刷新都重复访问数据库
var preparedPostData = []
var preparedAnceData = []
var preparedSearchData = []
var searchPage = -1
var lastKeywords = [];

//查询最新更新（四小时以内）的帖子，取前100
const sqlForGetLatestPost = "select * from post \
where update_date > (unix_timestamp(now())-14400) AND type = ? \
limit 0,100;";

//

//搜索查询，需要先建立post表中(title,content)的全文索引
//ALTER TABLE post ADD FULLTEXT INDEX ft_index (title,content);
const sqlForSearchPostByKeywords = "select * from post \
where MATCH (title,content) AGAINST (? IN BOOLEAN MODE) \
order by update_date DESC \
limit ?,100;"

async function getData(type, num){
    if(type == 0){
        if(preparedAnceData.length <= num){ //存量不足
            return new Promise((resolve,reject)=>{
                connection.query(sqlForGetLatestPost,[type],(err,rows,fields)=>{
                    if(err){
                        console.log("获取帖子数据时发生错误:",err);
                        reject([]);
                    }
                    console.log("获取的rows:",rows);
                    preparedAnceData = preparedAnceData.concat(rows);
                    let returnData = preparedAnceData.slice(0,num);
                    preparedAnceData = preparedAnceData.slice(num);
                    console.log("preparedData剩下：",preparedAnceData.length);
                    resolve(returnData);
                })
            });
        }
        else{ //存量充足
            let returnData = preparedAnceData.slice(0,num);
            preparedAnceData = preparedAnceData.slice(num);
            console.log("preparedData剩下：",preparedAnceData.length);
            return returnData;
        }
    }
    else if(type == 1){
        if(preparedPostData.length <= num){ //存量不足
            return new Promise((resolve,reject)=>{
                connection.query(sqlForGetLatestPost,[type],(err,rows,fields)=>{
                    if(err){
                        console.log("获取帖子数据时发生错误:",err);
                        reject([]);
                    }
                    preparedPostData = preparedPostData.concat(rows);
                    let returnData = preparedPostData.slice(0,num);
                    preparedPostData = preparedPostData.slice(num);
                    console.log("preparedData剩下：",preparedPostData.length);
                    resolve(returnData);
                })
            });
        }
        else{ //存量充足
            let returnData = preparedPostData.slice(0,num);
            preparedPostData = preparedPostData.slice(num);
            console.log("preparedData剩下：",preparedPostData.length);
            return returnData;
        }
    }
}

async function searchData(num,keyWords){
    if(keyWords.length==1 && keyWords[0]==""){
        return [];
    }
    if(checkSameKeywords(keyWords)){  //关键词相同
        if(preparedSearchData.length <= num){ //存量不足
            searchPage = searchPage + 1;
            let keyString = keyWords.join(' ');
            let pageOffset = searchPage*100;
            return new Promise((resolve,reject)=>{
                connection.query(sqlForSearchPostByKeywords, [keyString, pageOffset],(err,rows,fields)=>{
                    if(err){
                        console.log("补充搜索的时候发生错误：",err);
                        reject([]);
                    }
                    preparedSearchData = preparedSearchData.concat(rows);
                    let returnData = preparedSearchData.slice(0,num);
                    preparedSearchData = preparedSearchData.slice(num);
                    console.log("preparedSearchData剩下：",preparedSearchData.length);
                    resolve(returnData);
                })
            });
        }
        else{
            let returnData = preparedSearchData.slice(0,num);
            preparedSearchData = preparedSearchData.slice(num);
            console.log("preparedSearchData剩下：",preparedSearchData.length);
            return returnData;
        }
    }
    else{ //关键词不同，取新的结果
        searchPage = 0;
        lastKeywords = new Array(keyWords);
        let keyString = keyWords.join(' ');
        let pageOffset = searchPage*100;
        return new Promise((resolve,reject)=>{
            connection.query(sqlForSearchPostByKeywords, [keyString, pageOffset],(err,rows,fields)=>{
                if(err){
                    console.log("重新搜索的时候发生错误：",err);
                    reject([]);
                }
                preparedSearchData = rows;
                let returnData = preparedSearchData.slice(0,num);
                preparedSearchData = preparedSearchData.slice(num);
                console.log("preparedSearchData剩下：",preparedSearchData.length);
                resolve(returnData);
            })
        });
    }
    
}

function checkSameKeywords(keyWords){
    if(keyWords.length != lastKeywords.length){
        return false;
    }
    else{
        for(a in lastKeywords){
            if(!keyWords.includes(a)){
                return false;
            }
        }
        return true;
    }
}


app.listen(port,()=>console.log(`Example app listening on port ${port}!`))
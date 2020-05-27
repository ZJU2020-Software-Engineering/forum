// ================ Set Route ================ //
const express = require('express')
const app = express()
const port = 3291

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/forum/post/list', async (req,res)=>{
    console.log('收到请求')
    console.log(req.body)
    let data = await getData(req.body.num)
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

//每一次取数据取100条，预先储存
//使不用每一次刷新都重复访问数据库
var preparedData = []
var preparedSearchData = []
var searchPage = -1
var lastKeywords = [];

//查询最新更新（四小时以内）的帖子，取前100
const sqlForGetLatestPost = "select * from post \
where update_date > (unix_timestamp(now())-14400) \
limit 0,100;";

//搜索查询，需要先建立post表中(title,content)的全文索引
//ALTER TABLE post ADD FULLTEXT INDEX ft_index (title,content);
const sqlForSearchPostByKeywords = "select * from post \
where MATCH (title,content) AGAINST (? IN BOOLEAN MODE) \
order by update_date DESC \
limit ?,100;"

async function getData(num){
    if(preparedData.length <= num){ //存量不足
        return new Promise((resolve,reject)=>{
            connection.query(sqlForGetLatestPost,(err,rows,fields)=>{
                if(err) reject([]);
                preparedData = preparedData.concat(rows);  //补充进新的数据
                let returnData = preparedData.slice(0,num);
                preparedData = preparedData.slice(num);
                resolve(returnData);
            })
        });
    }
    else{ //存量充足
        let returnData = preparedData.slice(0,num);
        preparedData = preparedData.slice(num);
        return returnData;
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
                    if(err) reject([]);
                    preparedSearchData = preparedSearchData.concat(rows);
                    let returnData = preparedSearchData.slice(0,num);
                    preparedSearchData = preparedSearchData.slice(num);
                    resolve(returnData);
                })
            });
        }
        else{
            let returnData = preparedSearchData.slice(0,num);
            preparedSearchData = preparedSearchData.slice(num);
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
                if(err) reject([]);
                preparedSearchData = new Array(rows);
                let returnData = preparedSearchData.slice(0,num);
                preparedSearchData = preparedSearchData.slice(num);
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
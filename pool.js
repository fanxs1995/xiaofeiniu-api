/*
* MySQL数据库连接池
*/
const mysql=require("mysql");
//创建连接池
var pool = mysql.createPool({
    host:"127.0.0.1",       //数据库地址
    port:3306,              //数据库端口号
    user:"root",            // 数据库管理员
    password:"",            //数据库管理员密码
    database:"xiaofeiniu",  //默认连接数据库
    connectionLimit:10      //连接池中连接数量
});
//模块导出
module.exports=pool;

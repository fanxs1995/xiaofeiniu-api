/**
 * 管理员相关路由
 * 
 */

const express =require("express");
const pool = require("../../pool");
var router =express.Router();


/**
 * API  GET /admin/login
 * 完成用户登录验证(有的项目中此处学则post请求)
 * 请求数据：
 * {code:200,msg:"login succ"}
 * {code:400,msg:"aname or apwd err"}
 */

 router.get("/login/:aname/:apwd",(req,res)=>{
  //  console.log(req.body);
  var aname=req.params.aname;
  var apwd=req.params.apwd;
  console.log(aname);
  console.log(apwd);
  //用户输入的密码进行家吗函数操作
  pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[aname,apwd],(err,result)=>{
  if(err)throw err;
  if(result.length>0){
    //查询到数据
    res.send({code:200,msg:"login succ"})
  }else{//没有查到数据
    res.send({code:400,msg:"login not ssss"})
  }
  })
 })
 /*
 * API  PATCH /admin   修改部分数据用PATCH
 根据管理员名和密码修改管理员密码
 * 请求数据：
 * {code:200,msg:"modified succ"}
 * {code:400,msg:"aname or apwd err"}
 * {code:401,msg:"apwd not modified"}
 */
router.patch("/",(req,res)=>{
  //用户输入的密码进行家吗函数操作
  var data=req.body;
  console.log(data.aname);
  console.log(data.oldpwd);
  pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[data.aname,data.oldpwd],(err,result)=>{
  if(err)throw err;
  if(result.length==0){//没有查到数据
    res.send({code:400,msg:"login not ssss"})
    return ;
  } 
  //查询到数据
  // console.log(data.newPwd)
  pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?',[data.newPwd,data.aname],(err,result)=>{
    if(err) throw err;
    if(result.changedRows>0){//修改密码成功
      res.send({code:200,msg:"modify succ"})
    }else{  //新纽密码一样，
      res.send({code:401,msg:"pwd not modified"})
    }
  })
  })
 })

module.exports =router;



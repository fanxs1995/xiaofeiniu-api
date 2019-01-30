/**
 * 桌台相关路由器
 */

const express=require("express");
const pool=require("../../pool");
const router=express.Router();

/**
 * GET 、admin/table
 * 获取所有的桌台信息
 * 返回数值
 * [
 * {tid:2,tname:"xxx",status:""}]
 * 
 */
router.get("/",(req,res)=>{
  pool.query("SELECT * FROM xfn_table ORDER BY tid",(err,result)=>{
    if(err)throw err;
    res.send(result);
  })
})
module.exports=router;


const express=require("express");
const pool=require("../../pool");
const multer =require("multer");
const fs =require("fs");
var upload=multer({
  dest:"tmp/"   //指定客户端上传的文件临时储存路径
})
//定义路由，使用文件上传中间件


var router =express.Router();



// app.post("/damin/dish/image",upload.sinfle());
/**
 * 
 */

router.get("/",(req,res)=>{
  pool.query("SELECT cid,cname FROM xfn_category ORDER BY cid",(err,result)=>{
    if(err)throw err;
    //循环便利每一个菜品类别，查询类别下的哪儿一个菜品
    var categoryList=result;  //类别列表
    var finishCount=0;  //已经查询完菜品的类别的数量                    
    for(let c of categoryList){
      pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',c.cid,(err,result)=>{
        if(err)throw err;
        c.dishlist =result;
        finishCount++;
        //必须保证所有的类别下的菜品都查询完成才能发送响应消息--这些查询都是异步执行的
        if(finishCount==categoryList.length){
          res.send(result);
        }
      })
    }
  })
})

   
//生成随机一个文件名
//duffix 表示要生成的文件名中的后缀
function randFileName(suffix){
  var time = new Date().getTime();//当前系统时间戳
  var num =Math.floor(Math.random()*(10000-1000)+1000);//4位随机数字
  return time +"-"+num+suffix;
}


 /**
  * POST /admin/dish/img
  * 请求参数：
  *接收客户端上传的菜品图片，保存在服务器上，返回该图片在服务器上的随机文件名
  *
  */
router.post("/image",upload.single("dishImg"),(req,res)=>{
  // console.log(req.file);
  // console.log(req.body);
  var tmpFile = req.file.path; /// 临时文件名
  var suffix = req.file.originalname.substring(
    req.file.originalname.lastIndexOf("."));
    //原始文件名字的后缀部分
  var newFile = randFileName(suffix);//目标文件
  fs.rename(tmpFile,"img/dish/"+newFile,()=>{
    res.send({code:200,msg:"upload sycc",fileName:newFile});//把文件重命名 临时文件转移
  })
  
})
  /**
   * POST  /admin/dish
   * 请求参数：{title："xxxxx"imgUrl:"xxx",price:xx,detail:"xxx",categoryId=xxx}
   * 添加一个新的菜品
   * 输出消息{code:200,msg:"dish added succ",sidgTh:45}
   */
router.post("/",(req,res)=>{
  pool.query("INSERT INTO xfn_dish SET ?",req.body,(err,result)=>{
    if(err)throw err;
    res.send({code:200,msg:"dish added succ",dishId:result.insertId});
    //将INSERT语句产生的自增编号输入给客户端
  })
})

   
  /**
   * DELETE  /admin/dish/:did
   * 根据指定的曹琴编号删除该菜品
   * 输出消息{code:200,msg:"dish selete succ"}
   * 输出消息{code:400,msg:"dish not exists"}
   */


/**
   * PUT  /admin/dish/:did
   *请求参数：{did:xxx,title:"xxx",imgUrl:"...jpg",price:xxx,detail:"xxx",categoryId:xx}
   *根据指定的菜品编号修改菜品
   * 输出消息{code:200,msg:"dish updated succ"}
   * 输出消息{code:400,msg:"dish not exists"}
   */



  module.exports=router;
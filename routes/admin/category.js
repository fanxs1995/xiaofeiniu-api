/*
* 菜品类别相关的路由
*/

//创建路由器
const express=require("express");
const pool=require("../../pool");
var router =express.Router();

//API GET/admin/category
//含义  ： 客户端获取所有菜单产品类别；按编号升序排列
//返回值形如：[{cid:1,cname:''...},{....}]
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_category ORDER BY cid',(err,result)=>{
        if(err) throw err;
        var jsonData =JSON.stringify(result);
        res.send(jsonData);
    })
})

/*删除
API: DELETE /admin/category
含义  ： 客户端获取所有菜单产品类别；
返回值形如：
    {code："200",msg："1 category delete"}
    {code："400",msg："0 category delete"}
*/
router.delete("/:cid",(req,res)=>{
    //删除菜品类别前必须先把属于该类别的菜品的类别编号设置为NULL
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?',req.params.cid,(err,result)=>{
        if(err)throw err;
        //至此 指定类别的菜品已经修改完成
        pool.query('DELETE FROM xfn_category WHERE cid=?',req.params.cid,(err,result)=>{
            if(err) throw err;
            // 获取DELETE 语句在数据库中影响的行数
            if(result.affectedRows>0){
                res.send({code:200,msg:"1 category delete"})
            }else{
                res.send({code:400,msg:"0 categrory delete"})
            }
        })
    })
    
})

/*添加
*API: POST /admin/category
请求主体参数：{cname:"xxx"}
含义  ： 添加新的菜品类别
返回值形如：
    {code："200",msg："1 category added",cid:xxx}
*/
router.post("/",(req,res)=>{
    // console.log("获取到请求数据：");
    var data=req.body;  //刑如 {cname:xxx}
    console.log(data)
    pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{
        //注意此处SQL语句的简写
        if(err) throw err;
        res.send(result);
    })
})
/**
 * 修改
 * API: PUT /admin/category
请求主体参数：{cid:xx cname:"xxx"}
含义  ： 根据菜品类别编号修改该类别；
返回值形如：
    {code："200",msg："1 category modified"}
    {code："400",msg："0 category modified, not exists "}
    {code："401",msg："0 category modified no modification"}
 */
router.put('/',(req,res)=>{
    var data = req.body;  //请求数据{cid:'xxx',cname:'xxx'}
    //TODO 此处可以对输入的数据进行验证
    console.log(req.data);
    pool.query(" UPDATE xfn_category SET ? WHERE cid=?",[data,data.cid],(err,result)=>{
        if(err) throw err;

        if(result.changedRows>0){  //实际更新了一行
            res.send({code:200,msg:"1 category modified"})
        }else if(result.affectedRows==0){  //影响到0行
            res.send({code:400,msg:" category not exits"})
        }else if(result.affectedRows==0 && result.chengedRows==1){ //影响了1行，修改了0行
            res.send({code:401,msg:"no category modified"})
        }
    })
})
module.exports = router;
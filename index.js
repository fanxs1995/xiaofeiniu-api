/*
*小肥牛扫码点餐系统项目API子系统
*/
const PORT = 8090;
const express =require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const categoryRouter =require("./routes/admin/category");
const adminRouter =require("./routes/admin/addmin");
const dishRouter =require("./routes/admin/dish");


// 创建HTTP应用服务器

var app=express();
app.use(bodyParser.json());  //把json格式的请求主体数据解析出来放入req.body属性
app.use(cors({
    credentials:true,
    origin:"http://127.0.0.1:5500"
}));//跨域
// 启动主服务器
app.listen(PORT, ()=>{
    console.log("API 服务器启动成功... "+PORT);
});

// console.log(new Date().toLocaleString());
// npm i -g node-dev 
//挂载路由器

app.use("/admin/category",categoryRouter);
app.use("/admin",adminRouter);
app.use("/admin/dish",dishRouter);

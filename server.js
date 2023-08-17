const express=require("express");
const {serverPort}= require('./config')
const app=express()
const db=require("./db/db");

app.use(express.json())

app.get("/api/devices",async (req,res)=>{
    try{
        const result=await db.query(`select * from  device_c`);
        res.status(200).json({
            "status":"success",
            "data":result.rows
        })
    }
    catch(err){
        console.log(err);
    }
    
})




app.listen(serverPort,()=>{
    console.log(`Server is up and running on port ${serverPort}`);;
});

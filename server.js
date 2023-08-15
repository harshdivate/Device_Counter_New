const express=require("express");

const app=express()
const db=require("./db");

app.use(express.json())





app.get("/api/devices",async (req,res)=>{
    try{
        const result=await db.query(`select * from  device_c`);
        const rows=result.rows[0];
        res.status(200).json({
            "status":"success",
            "data":rows
        })
        console.log(rows);
    }
    catch(err){
        console.log(err);
    }
    
})

const port=3000;
console.log(port);

app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);;
});

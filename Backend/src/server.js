import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import rateLimiter from "./middleware/rateLimiter.js"
import transactionsRoutes from "./routes/transactionsRoutes.js"
import { initDB } from "./config/db.js"
import job from "./config/cron.js"
dotenv.config()

const PORT=process.env.PORT||2730

const app=express()

if(process.env.NODE_ENV==="production") job.start()
app.use(cors())
app.use(express.json())
app.use(rateLimiter)

app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok"})
})
app.use("/api/transactions",transactionsRoutes)

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("Damn bruh didn't see that coming ",PORT)
})
})
import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import transactionsRoutes from "./routes/transactionsRoutes.js"
import { initDB } from "./config/db.js"
dotenv.config()

const PORT=process.env.PORT||2730

const app=express()
app.use(express.json())
app.use(rateLimiter)


app.use("/api/transactions",transactionsRoutes)

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("Damn bruh didn't see that coming ",PORT)
})
})
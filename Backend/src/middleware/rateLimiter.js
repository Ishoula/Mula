import ratelimit from "../config/upstash.js"
const rateLimiter=async(req,res,next)=>{
    try {
        //use userId as the key
        const {success}=await ratelimit.limit("my-rate-limit")
        if(!success){
            res.status(429).json({
                message:"Too many request, please try again later."})
        }
        next()
    } catch (error) {
        console.log("Rate limit error",error)
        next(error)
    }
}

export default rateLimiter;
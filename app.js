require("dotenv").config()

const express=require("express")
const mongoose = require("mongoose")
const path=require("path")
const cookieParser=require("cookie-parser")
const app=express()
const PORT=process.env.PORT || 8000

const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")
const Blog = require("./models/blog")


const { checkforAuthenticationcookie } = require("./middlewares/authentication")

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Mongo db connected"))
.catch((err) => console.log("mongo db error", err))

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkforAuthenticationcookie("token"))
app.use(express.static(path.resolve("./public")))

app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", { user: req.user,
    blogs: allBlogs });
})

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))

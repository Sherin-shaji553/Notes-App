
require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./DB/index')
const path = require("path");

const PORT = process.env.PORT || 5000

const userRoutes = require('./router/userRoutes')
const noteRoutes = require('./router/noteRoutes')

const app = express()

app.use(express.json())
app.use(cors())
app.use("/api/users",userRoutes)
app.use("/api/notes",noteRoutes)




app.get('/',(req,res)=>{
    res.status(200).send("<h1>Server started....</h1>")
})

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})
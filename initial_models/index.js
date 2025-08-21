require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000


app.get( '/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res)=>{
    res.send("i m vikrant dubey and i m learning node js")
})

app.get('/login', (req, walk)=> {
    walk.send('<h1> please login</h1>')
})

app.listen(process.env.PORT, () => {
    console.log(`example app listening at ${port}`);
    
})



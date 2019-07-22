require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const route = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

mongoose.connect(process.env.DB_PATH, {useNewUrlParser : true, useCreateIndex: true}, (err) => {
    if(err) console.log('mongoose connection failed');
    else console.log('mongoose connection success');
});

app.use('/', route)

app.use(function(err, req, res, next){
    if(err.code){
        console.log('err: ', err);
        res.status(err.code).json(err)
    } else {
        console.log(err);
        res.status(500).json(err)
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
const express = require('express')
const app = express()
const path = require('path');




app.use(express.urlencoded({ extended: false }))


app.post('/register', (req, res) => {

    req.body.name 

})


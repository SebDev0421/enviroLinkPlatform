'use strict'

const mongoose = require('mongoose'),
      //URI = 'mongodb+srv://doadmin:71nG2F4a6D8yr3u0@db-mongodb-nyc1-90654-b926237c.mongo.ondigitalocean.com/envirolinkSAT?authSource=admin'
      URI = 'mongodb://localhost:27017/' // Local MongoDB URI for testing

mongoose.connect(URI)
        .then(()=>{
            console.log('DB Connect was connect')
            
        })
        .catch((err)=>{
            if(err) throw err
        })



module.exports = mongoose
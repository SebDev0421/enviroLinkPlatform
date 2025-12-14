'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      LogFoodSchema = new Schema({
          tag: {type:String},
          dateLog:{type:Date},
          controllerId:{type:String},
          port:{type:Number}
      },{
          collection:"logFood"
      }),
LogFoodModel = mongoose.model("LogFood",LogFoodSchema)

module.exports = LogFoodModel
'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      LogFoodSchema = new Schema({
          tag: {type:String},
          farmId: {type:String},
          dateLog:{type:Date}
      },{
          collection:"logFood"
      }),
LogFoodModel = mongoose.model("LogFood",LogFoodSchema)

module.exports = LogFoodModel
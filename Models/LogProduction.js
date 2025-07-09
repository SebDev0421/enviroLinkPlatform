'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      LogProductionSchema = new Schema({
          tag: {type:String},
          farmId: {type:String},
          dateLog:{type:Date},
          production:{type:Number,default:0}, //producción de leche
      },{
          collection:"LogProduction"
      }),
LogProductionModel = mongoose.model("LogProduction",LogProductionSchema)

module.exports = LogProductionModel
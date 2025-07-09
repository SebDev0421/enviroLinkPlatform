'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      CowsInformationSchema = new Schema({
          name: String,
          tag:String,
          country:String,
          breed:String,
          dateBorn:Date,
          weight:String,
          farmId:String,
          food:Number,
          portionsPerDay:Number,
          idGroup:String,
          nameGroup:String, //nombre del grupo de producción al que pertenece la vaca,
          Comments:[{
              comment:String,
              date:Date
          }]
      },{
          collection:"cowsInformation"
      }),
CowsInformationModel = mongoose.model("CowsInformation",CowsInformationSchema)

module.exports = CowsInformationModel
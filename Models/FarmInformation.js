'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      FarmInformationSchema = new Schema({
          name:{type:String},
          location:[Number],
          cluster:{type:Boolean,default:0}
      },{
          collection:"farmInformation"
      }),
FarmInformationModel = mongoose.model("FarmInformation",FarmInformationSchema)

module.exports = FarmInformationModel
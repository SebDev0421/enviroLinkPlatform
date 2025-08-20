'use strict'

const { act } = require('react')

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      StationsSchema = new Schema({
          create:String,
          name: String,
          numberSubProject:String,
          numberId:String,
          serialController:String,
          location:[Array],
          createDate:Date,
          serials:[String], // array of serial numbers for connected devices
          model:[String],//0 for serie C 1 for serie i
          types:[Number] // array of device types
      },{
          collection:"stations"
      }),
StationsModel = mongoose.model("Stations",StationsSchema)

module.exports = StationsModel
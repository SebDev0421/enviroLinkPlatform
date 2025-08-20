'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      DeviceControllerEnvirolinkSchema = new Schema({
          idController: String,
          idStation:String,
          currentStationId:String,
          samplingInterval:{type:Number,default:1}, // in minutes
          stationId:String, // id of the station
          serials:[String], // array of serial numbers for connected devices
          model:[String],//0 for serie C 1 for serie i
          types:[Number], // array of device types
      },{
          collection:"deviceControllerEnvirolink"
      }),
DeviceControllerEnvirolinkModel = mongoose.model("DeviceControllerEnvirolink",DeviceControllerEnvirolinkSchema)

module.exports = DeviceControllerEnvirolinkModel
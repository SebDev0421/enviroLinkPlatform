'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      LoggersEnvirolinkSchema = new Schema({
        createTime: {type: Date}, // time when the data was created
        idController: String,
        idStation:String, // id of the station
        type:{type:Number}, // type of logger
        model:{type:String}, //0 for serie C 1 for serie i
        serial:{type:String}, //serial number of the logger
        data:String //data froma machine
      },{
          collection:"LoggersEnvirolink"
      }),
LoggersEnvirolinkModel = mongoose.model("LoggersEnvirolink",LoggersEnvirolinkSchema)

module.exports = LoggersEnvirolinkModel
'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      DeviceControllerSchema = new Schema({
          idController: String,
          timeMotor1:{type:Number,default:1.0},
          timeMotor2:{type:Number,default:1.0},
          timeMotor1Off:{type:Number,default:1.0},
          timeMotor2Off:{type:Number,default:1.0},
          pulsesKg1:{type:Number,default:5},
          pulsesKg2:{type:Number,default:5},
          farmId:{type:String,default:"insuagro"}
      },{
          collection:"deviceController"
      }),
DeviceControllerModel = mongoose.model("DeviceController",DeviceControllerSchema)

module.exports = DeviceControllerModel
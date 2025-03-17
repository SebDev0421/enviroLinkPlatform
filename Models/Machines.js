'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      MachinesSchema = new Schema({
          serial:String,
          brand: String,
          parameters:[Array],
          photo:String
      },{
          collection:"machines"
      }),
MachinesModel = mongoose.model("Machines",MachinesSchema)

module.exports = MachinesModel
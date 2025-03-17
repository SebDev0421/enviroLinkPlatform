'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      StationsSchema = new Schema({
          create:String,
          name: String,
          numberSubProject:String,
          numberId:String,
          location:[Array],
          createDate:Date,
          machines:[Array],
      },{
          collection:"stations"
      }),
StationsModel = mongoose.model("Stations",StationsSchema)

module.exports = StationsModel
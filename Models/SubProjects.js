'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      SubProjectsSchema = new Schema({
          create:String,
          name: String,
          numberProject:String,
          numberId:String,
          location:[Array],
          createDate:Date
      },{
          collection:"subProjects"
      }),
SubProjectsModel = mongoose.model("SubProjects",SubProjectsSchema)

module.exports = SubProjectsModel
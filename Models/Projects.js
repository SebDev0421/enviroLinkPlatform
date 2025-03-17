'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ProjectsSchema = new Schema({
          create:String,
          name: String,
          numberId:String,
          client:String,
          createDate:Date
      },{
          collection:"projects"
      }),
ProjectsModel = mongoose.model("Projects",ProjectsSchema)

module.exports = ProjectsModel
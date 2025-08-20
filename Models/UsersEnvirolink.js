'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      UsersEnvirolinkSchema = new Schema({
          name:{type:String},
          email:{type:String},
          password:{type:String},
          idCompany:{type:String},
          photo:{type:String,default:"/imagesUsers/default.png"}
      },{
          collection:"UsersEnvirolink"
      }),
UsersEnvirolinkModel = mongoose.model("UsersEnvirolink",UsersEnvirolinkSchema)

module.exports = UsersEnvirolinkModel
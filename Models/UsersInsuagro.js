'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      UsersInsuagroSchema = new Schema({
          name:{type:String},
          email:{type:String},
          password:{type:String},
          Permissions:{type:String,default:"user"},//user,admin
          idFarm:{type:String},
          photo:{type:String,default:"/imagesUsers/default.png"}
      },{
          collection:"usersInsuagro"
      }),
UsersInsuagroModel = mongoose.model("UsersInsuagro",UsersInsuagroSchema)

module.exports = UsersInsuagroModel

const UsersInsuagro = require('../Models/UsersInsuagro')
const mongoose = require('mongoose')

const express = require('express'),
      app = express.Router()


app.put('/addUser',async(req,res)=>{
    const {name,email,password,idFarm} = req.body

    console.log(req.body)

    await UsersInsuagro.findOne({email:email}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            //write new cow in db
            const usersInsuagro = new UsersInsuagro({name,email,password,idFarm})
            await usersInsuagro.save()
            await res.json({msg:"el usuario fue agregada al registro",status:200})
        }else{
            res.json({msg:"el usuario ya existe en el registro",status:201})
        }
    })
})

app.put('/loginUser',async(req,res)=>{
    const {email,password} = req.body
    console.log(email,password)
    res.json({login:await UsersInsuagro.findOne({email:email,password:password})})
})


app.get('/deleteUser',async(req,res)=>{
    const {email,password} = req.query
    console.log(email,password)
    res.json({login:await UsersInsuagro.findOne({email:email,password:password})})
})


app.put('/consultUser',async(req,res)=>{
    const {idUser} = req.body
    res.json({user:await UsersInsuagro.findOne({_id:idUser})})
})


module.exports = app
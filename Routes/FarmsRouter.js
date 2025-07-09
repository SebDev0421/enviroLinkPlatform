
const FarmInformation = require('../Models/FarmInformation')
const mongoose = require('mongoose')

const express = require('express'),
      app = express.Router()


app.put('/addFarm',async(req,res)=>{
    const {name,location} = req.body

    console.log(name)

    await FarmInformation.findOne({name:name}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            //write new cow in db
            const farmInformation = new FarmInformation({name:name,location:location})
            await farmInformation.save()
            await res.json({msg:"la finca fue agregada al registro",status:200})
        }else{
            res.json({msg:"la finca ya existe en el registro",status:201})
        }
    })
    
})

app.put('/consultFarm',async(req,res)=>{
    const {idFarm} = req.body
    console.log(idFarm)
    res.json({farm:await FarmInformation.findOne({_id:idFarm})})
})



module.exports = app
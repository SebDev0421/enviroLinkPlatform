
const DevicesController = require('../Models/DevicesController')
const mongoose = require('mongoose')

const express = require('express'),
      app = express.Router()


app.put('/addDevice',async(req,res)=>{
    const {idController} = req.body

    console.log(req.body)

    await DevicesController.findOne({idController:idController}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            //write new cow in db
            const devicesController = new DevicesController({idController})
            await devicesController.save()
            await res.json({msg:"el controlador fue agregada al registro",status:200})
        }else{
            res.json({msg:"el controlador ya existe en el registro",status:201})
        }
    })

    

})

app.put('/getDevicesFarm',async(req,res)=>{
    const {idFarm} = req.body
    console.log("idFarm",idFarm)
    res.json({devices:await DevicesController.find({farmId:idFarm})})
})

app.get('/devicesController',async(req,res)=>{
    const {getDevice} = req.query
    console.log(getDevice)
    res.json({msg:await DevicesController.findOne({idController:getDevice})})
})

app.put('/modifyDeviceFarm',async(req,res)=>{
    const {idController,farmId} = req.body
    console.log(idController,farmId)
    await DevicesController.updateOne({idController:idController},{$set:{farmId:farmId}})
    res.json({msg:"el controlador fue modificado correctamente",status:200})
})

app.put('/calibrateDevice',async(req,res)=>{
    // modify time and pulse of the device
    const {idController,farmId,timeMotor1,timeMotor1Off,timeMotor2,timeMotor2Off,pulsesKg1,pulsesKg2} = req.body
    console.log(idController,farmId)
    console.log(req.body)
    await DevicesController.updateOne({idController:idController,farmId:farmId},{$set:{timeMotor1:parseFloat(timeMotor1),timeMotor1Off:parseFloat(timeMotor1Off),timeMotor2:parseFloat(timeMotor2),timeMotor2Off:parseFloat(timeMotor2Off),pulsesKg1:pulsesKg1,pulsesKg2:pulsesKg2}})
    res.json({msg:"el controlador fue modificado correctamente",status:200})

    //send socket message to the device
})


module.exports = app
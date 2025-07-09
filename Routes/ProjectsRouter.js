'use strict'

const Projects = require('../Models/Projects')
const SubProjects = require('../Models/SubProjects')
const Stations = require('../Models/Stations')
const Machines = require('../Models/Machines')


const mongoose = require('mongoose')



const express = require('express'),
      app = express.Router()

const Settings = require('../settings')

const URIServer = Settings.ip

app.put('/addProject',async(req,res)=>{
    const {create,name,numberId,client,createDate} = req.body
    console.log(numberId)
    await Projects.findOne({numberId:numberId}).then(async(obj)=>{
        console.log(obj)
        if(obj == null){
            const projects =  new Projects({create,name,numberId,client,createDate})
            await projects.save()
            await res.json({status:'project was create'})
        }else{
            res.json({status:'project already exist'})
        }
    })
})


app.put('/addSubProject',async(req,res)=>{
    const {create,name,numberProject,numberId,location,createDate} = req.body
    console.log(numberId)
    await Projects.findOne({numberId:numberProject}).then(async(obj)=>{
        console.log(obj)
        const subProjects =  new SubProjects({create,name,numberProject,numberId,location,createDate})
        await subProjects.save()
        await res.json({status:'subproject was create'})
    })
})

app.put('/addStations',async(req,res)=>{
    const {create,name,numberSubProject,numberId,location,createDate,machines} = req.body
    console.log(numberId)
    await Stations.findOne({numberId:numberId}).then(async(obj)=>{
        console.log(obj)
        if(obj == null){
            const stations =  new Stations({create,name,numberSubProject,numberId,location,createDate,machines})
            await stations.save()
            await res.json({status:'station was create'})
        }else{
            res.json({status:'station already exist'})
        }
    })
})


app.get('/getProjects',async(req,res)=>{

    res.json( {projects:await Projects.find()})

})

app.put('/getSubProjects',async(req,res)=>{
    const {numberProject} = req.body
    res.json( {subprojects:await SubProjects.find({numberProject:numberProject})})
})


app.put('/getStations',async(req,res)=>{
    const {numberSubProject} = req.body
    res.json( {stations:await Stations.find({numberSubProject:numberSubProject})})
})

app.put('/getStationInfo',async(req,res)=>{
    const {numberId} = req.body
    console.log(numberId)
    res.json( {station:await Stations.find({numberId:numberId})})
})

app.put('/getMachineInfo',async(req,res)=>{
    const {serial} = req.body
    console.log(serial)
    res.json( {machine:await Machines.find({serial:serial})})
})

app.put('/getStationData',async(req,res)=>{
    const {serial,DateInit,DateEnd} = req.body

    console.log(DateInit)
    console.log(DateEnd)
    const db = mongoose.connection.db;
    const collection = db.collection(serial)          
    collection.find({DateTime:{$gte: DateInit,$lt: DateEnd}}).sort({DateTime:-1}).toArray()
    .then((docs)=>{
        res.json( {station:docs})
        console.log(docs)
    })
    .catch((err)=>{
        console.error("Error:", err);
        res.json( {station:err})
    })
    
})






module.exports = app
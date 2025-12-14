
const CowsInformation = require('../Models/CowsInformation')
const ProductionGroups = require('../Models/ProductionGroups')
const LogFood = require('../Models/LogFood')
const LogProduction = require('../Models/LogProduction')
const mongoose = require('mongoose')

const express = require('express'),
      app = express.Router()


app.put('/addCow',async(req,res)=>{
    const {name,tag,country,breed,dateBorn,weight,farmId,food,portionsPerDay,idGroup,Comments} = req.body

    let foodPortion = 0
    let nameGroup = ""
    console.log("idGroup",idGroup)
    if(idGroup == ""){
        foodPortion = food //asignar la porción de alimento
        console.log("food",food)
    }else{
        //buscar el grupo de producción por id
        const group = await ProductionGroups.findOne({_id:idGroup})
        console.log("group",group)
        nameGroup = group.name //asignar el nombre del grupo de producción
        foodPortion = group.food //asignar la porción del grupo de producción
        console.log("food",foodPortion)
    }
    await CowsInformation.findOne({tag:tag,farmId:farmId}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            //write new cow in db
            const cowsInformation = new CowsInformation({name,tag,country,breed,dateBorn,weight,farmId,food:foodPortion,portionsPerDay,idGroup,nameGroup,Comments})
            await cowsInformation.save()
            await res.json({msg:"La vaca fue agregada al registro",status:200})
        }else{
            res.json({msg:"La vaca ya existe en el registro",status:201})
        }
    })
})

app.put('/getCow',async(req,res)=>{
    const {idFarm,tag} = req.body
    
    await CowsInformation.findOne({tag:tag,farmId:idFarm}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            res.json({msg:"La vaca no existe en el registro",status:201})
        }else{
            res.json({msg:"La vaca fue encontrada en el registro",status:200,cow:obj})
        }
    })

})

app.put('/consultCows',async(req,res)=>{
    const {idFarm} = req.query
    console.log("idFarm",req.query)
    res.json({cows:await CowsInformation.find({idFarm:idFarm})})
})

app.put('/editCow',async(req,res)=>{
    const {idFarm,tag,weight,food,portionsPerDay,idGroup} = req.body
    console.log("cow edit information",req.body)
    let foodPortion = 0
    let nameGroup = ""
    if(idGroup == ""){
        foodPortion = food //asignar la porción de alimento
        console.log("food",food)
    }else{
        //buscar el grupo de producción por id
        const group = await ProductionGroups.findOne({_id:idGroup})
        console.log("group",group)
        nameGroup = group.name //asignar el nombre del grupo de producción
        foodPortion = group.food //asignar la porción del grupo de producción
        console.log("food",foodPortion)
    }
    await CowsInformation.findOneAndUpdate(
        {tag:tag,farmId:idFarm},
        {tag:tag,weight:weight,food:foodPortion,portionsPerDay:portionsPerDay,idGroup:idGroup,nameGroup:nameGroup},
        {new:true}
    ).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            res.json({msg:"La vaca no existe en el registro",status:201})
        }else{
            res.json({msg:"La vaca fue editada correctamente",status:200,cow:obj})
        }
    }).catch((err)=>{
        console.log(err)
        res.json({msg:"Error al editar la vaca",status:500})
    })
})

app.delete('/deleteCow',async(req,res)=>{
    const {idFarm,tag} = req.body
    console.log("cow delete information",req.body)
    await CowsInformation.findOneAndDelete({tag:tag,farmId:idFarm}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            res.json({msg:"La vaca no existe en el registro",status:201})
        }else{
            res.json({msg:"La vaca fue eliminada correctamente",status:200})
        }
    }).catch((err)=>{
        console.log(err)
        res.json({msg:"Error al eliminar la vaca",status:500})
    }
)
})

app.get('/cowFoodInformation',async(req,res)=>{
    const {idCow,idFarm,motorStation,idController} = req.query
    console.log(idCow,motorStation,idController)
    //consult all log food today and compare with portion per day

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    console.log("formattedDate",formattedDate)

    const UTCColombia = formattedDate.replace(' ', 'T') + 'Z';
    const todayLog = new Date(UTCColombia);
    const today = new Date(UTCColombia);
    console.log("today",today)
    today.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo la fecha
    const cowInfo = await CowsInformation.findOne({tag:idCow});

    //consult all log food today
    const logFoodToday = await LogFood.find({
        tag: idCow,
        dateLog: {
            $gte: today // Buscar registros desde el inicio del día actual
        }
    });

    if(!cowInfo){
        return res.status(404).json({status:404,cow: 'Vaca no encontrada.'});
    }

    console.log("logFoodToday",logFoodToday.length)
    
    
    portionsRest = cowInfo.portionsPerDay - logFoodToday.length
    console.log("portionsRest",portionsRest)

    //get last log food entry
    const lastLogFood = logFoodToday[logFoodToday.length - 1];

    const dateTimeLastLog = lastLogFood.dateLog;
    console.log("dateTimeLastLog",dateTimeLastLog)

    //if 1 hour has passed since last log food
    if(lastLogFood){
        const oneHourLater = new Date(dateTimeLastLog);
        oneHourLater.setHours(oneHourLater.getHours() + 1);
        console.log("oneHourLater",oneHourLater)
        console.log("currentTime",todayLog)
        if(todayLog < oneHourLater){
            return res.status(400).json({status:400,cow: 'Debe esperar al menos una hora antes de agregar otra porción.'});
        }
    }

    
    if(portionsRest > 0){
        //add to logFood the portion per day to mongo
        await LogFood.create({
            tag: idCow,
            motorStation: motorStation,
            controllerId: idController,
            port: motorStation.toString(),
            dateLog: todayLog
        })
        res.json({status:201,cow:cowInfo})
    }else{
        return res.status(400).json({status:400,cow: 'No se puede agregar más porciones hoy.'});
    }
    
})

app.put('/addProductionGroup',async(req,res)=>{


    const {name,farmId,minProduction,maxProduction,food} = req.body

    //verificar si el rango de producción no se solapa con otros grupos existentes
    const overlappingGroups = await ProductionGroups.find({
    farmId,
    $or: [
      { minProduction: { $lte: maxProduction }, maxProduction: { $gte: minProduction } }, // Solapamiento parcial
      { minProduction: { $gte: minProduction }, maxProduction: { $lte: maxProduction } }, // Nuevo rango contiene uno existente
    ],
  });

   console.log(overlappingGroups.length); // Si no hay coincidencias, se puede crear
   if (overlappingGroups.length > 0) {
        return res.status(400).json({ msg: 'El rango de producción se solapa con otro grupo existente.' });
    }else{
        const productionGroup = new ProductionGroups({name,farmId,minProduction,maxProduction,food})
        await productionGroup.save()
        res.json({msg:"Grupo de producción agregado correctamente",status:200})
    }
})

app.put('/consultProductionGroup',async(req,res)=>{
    const {idFarm} = req.body
    console.log("idFarm",req.body)
    res.json({groups:await ProductionGroups.find({farmId:idFarm})})
})

app.put('/editProductionGroup',async(req,res)=>{
    const {idGroup,name,farmId,minProduction,maxProduction,food} = req.body
    console.log("idGroup",idGroup)
    //verificar si el rango de producción no se solapa con otros grupos existentes
    const overlappingGroups = await ProductionGroups.find({
    farmId,
    _id: { $ne: idGroup }, // Excluir el grupo que se está editando
    $or: [
      { minProduction: { $lte: maxProduction }, maxProduction: { $gte: minProduction } }, // Solapamiento parcial
      { minProduction: { $gte: minProduction }, maxProduction: { $lte: maxProduction } }, // Nuevo rango contiene uno existente
    ],
  });
    console.log(overlappingGroups.length); // Si no hay coincidencias, se puede editar
    if (overlappingGroups.length > 0) {
        return res.status(400).json({ msg: 'El rango de producción se solapa con otro grupo existente.' });
    }else{
        await ProductionGroups.findOneAndUpdate(
            {_id:idGroup,farmId:farmId},
            {name:name,minProduction:minProduction,maxProduction:maxProduction,food:food},
            {new:true}
        ).then(async(obj)=>{
            console.log(obj)
            if(obj==null){
                res.json({msg:"El grupo de producción no existe en el registro",status:201})
            }else{
                //update all cows with idGroup
                await CowsInformation.updateMany(
                    {idGroup:idGroup,farmId:farmId},
                    {nameGroup:name,food:food}
                )
                res.json({msg:"El grupo de producción fue editado correctamente",status:200,cow:obj})
            }
        }).catch((err)=>{
            console.log(err)
            res.json({msg:"Error al editar el grupo de producción",status:500})
        })
    }
})

app.delete('/deleteProductionGroup',async(req,res)=>{
    const {idGroup,farmId} = req.body
    console.log("idGroup",idGroup)
    await ProductionGroups.findOneAndDelete({_id:idGroup,farmId:farmId}).then(async(obj)=>{
        console.log(obj)
        if(obj==null){
            res.json({msg:"El grupo de producción no existe en el registro",status:201})
        }else{
            //update all cows with idGroup to set idGroup to ""
            await CowsInformation.updateMany(
                {idGroup:idGroup,farmId:farmId},
                {idGroup:"",nameGroup:"",food:0}
            )
            res.json({msg:"El grupo de producción fue eliminado correctamente",status:200})
        }
    }).catch((err)=>{
        console.log(err)
        res.json({msg:"Error al eliminar el grupo de producción",status:500})
    }
)
})

app.put('/consultFoodLog',async(req,res)=>{
    const {idFarm,dateConsult} = req.body
    console.log("idFarm",idFarm)
    res.json({logFood:await LogFood.find({dateLog: { $gte: new Date(dateConsult) , $lt: new Date(new Date(dateConsult).getTime() + 24 * 60 * 60 * 1000) }, })})

})


module.exports = app
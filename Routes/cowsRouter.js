
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
    const {idCow,idFarm} = req.query
    console.log(idCow)
    //consult all log food today and compare with portion per day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo la fecha
    const cowInfo = await CowsInformation.findOne({tag:idCow});
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
    
    if(portionsRest > 0){
        //add to logFood the portion per day to mongo
        await LogFood.create({
            tag: idCow,
            farmId: idFarm,
            dateLog: new Date()
        });
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

app.put('/consultFoodLog',async(req,res)=>{
    const {tag} = req.body
    console.log("idFarm",req.body)
    res.json({logFood:await LogFood.find({tag:tag})})
})


module.exports = app
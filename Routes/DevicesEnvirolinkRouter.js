
const DevicesController = require('../Models/DevicesControllerEnvirolink')
const LoggersEnvirolink = require('../Models/LoggersEnvirolink')
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



//get all devices for a specific client
app.put('/getDevicesClient',async(req,res)=>{
    const {idFarm} = req.body
    console.log("idFarm",idFarm)
    res.json({devices:await DevicesController.find({farmId:idFarm})})
})



app.put('/putDataController',async(req,res)=>{
    const {idController,idStation,type,model,serial,data} = req.body
    
    console.log("idController",idController)
    console.log("idStation",idStation)
    console.log("type",type)
    console.log("model",model)
    console.log("serial",serial)
    console.log("data",data)

    //generate date time current in server colombia to save in ISO
    const currentDate = new Date();
    //to colombia hour
    const colombiaOffset = -5 * 60 * 60 * 1000;
    const createTime = new Date(currentDate.getTime() + colombiaOffset);
    //save data in the loggersEnvirolink model
    const logger = new LoggersEnvirolink({createTime,idController,idStation,type,model,serial,data})
    await logger.save()
    console.log("logger saved",logger)
    res.json({msg:"data saved successfully",status:200})
})

app.put('/getDataController',async(req,res)=>{
    const {idController,idStation,serial,size} = req.body
    console.log("idController",idController)
    //find all loggers for a specific controller
    if(!idController) return res.status(400).json({msg:"No controller id provided"})
    const loggers = await (await LoggersEnvirolink.find({idController:idController, idStation:idStation, serial:serial}).limit(size))
    if(!loggers) return res.status(404).json({msg:"No loggers found for this controller"})
    console.log("loggers",loggers)
    //return loggers
    res.json({msg:loggers})
})

app.put('/getDevicePlatform',async(req,res)=>{
    const {idController} = req.body
    console.log("idController",idController)
    //find device by idController
    if(!idController) return res.status(400).json({msg:"No device id provided"})
    //find device by idController
    console.log("getDevice",idController)
    const device = await DevicesController.findOne({idController:idController})
    if(!device) return res.status(404).json({msg:"Device not found"})
    console.log("device",device)
    //return device
    res.json({msg:device})
})

app.get('/getDeviceById',async(req,res)=>{
    const {idController} = req.query
    console.log(idController)
    //find device by idController
    if(!idController) return res.status(400).json({msg:"No device id provided"})
    //find device by idController
    console.log("getDevice",idController)
    const device = await DevicesController.findOne({idController:idController})
    if(!device) return res.status(404).json({msg:"Device not found"})
    console.log("device",device)
    //return device
    res.json({msg:device})
})

app.post('/uploadDataToDatalogger',async(req,res)=>{
    const {idController,stationId,serials,types,model} = req.body

    console.log("idController",idController)
    console.log("stationId",stationId)
    console.log("serials",serials)
    console.log("types",types)
    console.log("model",model)

    //update device by idController
    if(!idController) return res.status(400).json({msg:"No device id provided"})
    
    const updatedDevice = await DevicesController.findOneAndUpdate(
        {idController:idController},
        {stationId:stationId,serials:serials,types:types,model:model},
        {new:true}
    )
    
    if(!updatedDevice) return res.status(404).json({msg:"Device not found"})
    
    console.log("updatedDevice",updatedDevice)
    
    res.json({msg:updatedDevice})
});

app.put('/getDataControllerAll',async(req,res)=>{
  const {idStation,serial} = req.body
  console.log("idStation",idStation)
  console.log("serial",serial)
  //find all loggers for a specific controller
  if(!idStation) return res.status(400).json({msg:"No station id provided"})
  const loggers = await LoggersEnvirolink.find({idStation:idStation, serial:serial}).sort({createTime:-1})
  if(!loggers) return res.status(404).json({msg:"No loggers found for this station"})
  console.log("loggers",loggers)
  //return loggers
  res.json({msg:loggers})
});




module.exports = app




/* codigo para decodificar el data de los loggers
function parseLogLine(line) {
  const regex = /^lrec\s+(\d+)\s+(\d+)\s+(\d{2}:\d{2})\s+(\d{2}-\d{2})\s+(\w+)\s+([\d.E+-]+)\s+(ppb|ppm)\s+flags\s+([0-9a-fA-F]+)\s+ratio\s+([\d.]+)\s+agci\s+(\d+)\s+intt\s+([\d.]+)\s+chmbt\s+([\d.]+)\s+flow\s+([\d.]+)\s+pres\s+([\d.]+)sum\s+([0-9a-fA-F]+)$/;

  const match = line.match(regex);
  if (!match) return null;

  const [
    _,
    recNum,
    chan,
    time,
    date,
    gas,
    concRaw,
    unit,
    flagsHex,
    ratio,
    agci,
    intt,
    chmbt,
    flow,
    pres,
    checksum
  ] = match;

  // Conversión: notación científica → número → dividir entre 1000
  const concPPB = Number(concRaw);
  const concPPM = concPPB / 1000;

  return {
    recordNumber: parseInt(recNum),
    channel: parseInt(chan),
    time,
    date,
    gas,
    concentrationPPB: concPPB,
    concentrationPPM: concPPM,
    unit,
    flags: flagsHex,
    flagsBinary: parseInt(flagsHex, 16).toString(2).padStart(32, '0'),
    ratio: parseFloat(ratio),
    agci: parseInt(agci),
    integrationTime: parseFloat(intt),
    chamberTemp: parseFloat(chmbt),
    flow: parseFloat(flow),
    pressure: parseFloat(pres),
    checksum
  };
}

const logLine = "lrec 1 1 13:42 08-15 co 9460E-1 ppb flags 9c040400 ratio 1.156619 agci 200462 intt 30.5 chmbt 49.2 flow 0.206 pres 499.3sum 1f61";
console.log(parseLogLine(logLine));
// Este código es un ejemplo de cómo decodificar una línea de loggersEnvirolink
// y extraer los datos relevantes. Puedes adaptarlo según tus necesidades
//solo funcina si el dato es de un type 48
*/


/*
function parseNOxLogLine(line) {
  const regex = /^lrec\s+(\d+)\s+(\d{2}:\d{2})\s+(\d{2}-\d{2}-\d{2})\s+flags\s+([0-9A-Fa-f]+)\s+no\s+(-?[\d.]+)\s+nox\s+(-?[\d.]+)\s+hino\s+(-?[\d.]+)\s+hinox\s+(-?[\d.]+)\s+pres\s+(-?[\d.]+)\s+pmtt\s+(-?[\d.]+)\s+intt\s+(-?[\d.]+)\s+rctt\s+(-?[\d.]+)\s+convt\s+(-?[\d.]+)\s+smplf\s+(-?[\d.]+)\s+ozonf\s+(-?[\d.]+)\s+pmtv\s+(-?[\d.]+)\*sum\s+([0-9A-Fa-f]+)$/;

  const match = line.match(regex);
  if (!match) return null;

  const [
    _,
    recordNumber,
    time,
    date,
    flagsHex,
    no,
    nox,
    hino,
    hinox,
    pres,
    pmtt,
    intt,
    rctt,
    convt,
    smplf,
    ozonf,
    pmtv,
    checksum
  ] = match;

  return {
    recordNumber: parseInt(recordNumber),
    time,
    date,
    flags: flagsHex,
    flagsBinary: parseInt(flagsHex, 16).toString(2).padStart(32, '0'),
    no: parseFloat(no),
    nox: parseFloat(nox),
    hino: parseFloat(hino),
    hinox: parseFloat(hinox),
    pressure: parseFloat(pres),
    pmtTemp: parseFloat(pmtt),
    integrationTime: parseFloat(intt),
    reactionTemp: parseFloat(rctt),
    converterTemp: parseFloat(convt),
    sampleFlow: parseFloat(smplf),
    ozoneFlow: parseFloat(ozonf),
    pmtVoltage: parseFloat(pmtv),
    checksum
  };
}

const logLine2 = "lrec 1 114:02 08-15-25 flags CC000600 no -0.02 nox 0.01 hino 0.00 hinox 0.00 pres 534.877 pmtt -5.963 intt 32.400 rctt 50.433 convt 326.306 smplf 0.000 ozonf 0.050 pmtv -613.831*sum 2e57";
console.log(parseNOxLogLine(logLine2));
*/


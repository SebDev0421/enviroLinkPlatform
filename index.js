'use strict'

const { mongo } = require('mongoose')

const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const router = express.Router()
const mongoose = require('./Database')
const fs = require('fs')
const port = (process.env.PORT || 3000)

const http = require('http')
const socketIo = require('socket.io')

const server = http.createServer(app);

const io = socketIo(server, {
  transports: ['websocket'], // 🚨 Importante para ESP32
  allowEIO3: true // Por si el cliente usa Engine.IO v3 (opcional si usas socket.io@2)
});


const morgan = require('morgan')

const DevicesRouter = require('./Routes/DevicesEnvirolinkRouter')

const UsersEnvirolinkRouter = require('./Routes/UsersEnvirolinkRouter')

const ProjectsRouter = require('./Routes/ProjectsRouter')
const ProjectsRouterCows = require('./Routes/cowsRouter')
const ProjectsRouterDevices = require('./Routes/DevicesCowRouter')
const ProjectsRouterUsers = require('./Routes/UsersInsuagroRouter')
const ProjectsRouterFarms = require('./Routes/FarmsRouter')

//Settings
app.set('port',port)

//middlewares
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json())
app.use('/Envirolink/API/Projects/',ProjectsRouter)

app.use('/Envirolink/API/Devices/',DevicesRouter)

app.use('/Envirolink/API/Users/',UsersEnvirolinkRouter)

app.use('/CowFood/API/Cows/',ProjectsRouterCows)

app.use('/CowFood/API/Devices/',ProjectsRouterDevices)

app.use('/CowFood/API/Users/',ProjectsRouterUsers)

app.use('/CowFood/API/Farms/',ProjectsRouterFarms)




const staticPath = path.join(__dirname,'public/html/')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/Dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/loginEnvirolink', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loginEnvirolink.html'));
});

app.get('/registerEnvirolink', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registerEnvirolink.html'));
});

app.get('/subProyecto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'subProjects.html'));
});

app.get('/estaciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stationList.html'));
});

app.get('/estacion', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stationView.html'));
});

app.get('/machineView', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'machineEnvirolinkView.html'));
});

app.get('/mapMonitoring',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'service.html'));
})








app.get('/insuagroApp/dashboard',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'cowsview.html'));
})

app.get('/insuagroApp/listadevacas',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'listConfCowInsuagro.html'));
})

app.get('/insuagroApp/gruposdeproduccion',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'clusterProductionInsuagro.html'));
})



app.get('/insuagroApp/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'loginInsuagro.html'));
})

app.get('/insuagroApp/register',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'registerInsuagro.html'));
})

app.get('/insuagroApp/Dispositivos',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'controllersInsuagro.html'));
})

app.get('/insuagroApp/Vaca',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'cowViewDetailed.html'));
    // Aquí podrías enviar el tag a la vista si es necesario
    // res.render('cowViewDetailed', { tag: tag });
});



// Configura Multer para guardar en /photocows
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/photoCows';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Crea la carpeta si no existe
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Usa el nombre que viene del frontend (sanitizado)
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload-cow-photo', upload.single('photo'), (req, res) => {
  console.log(req.body)
  if (!req.file) return res.status(400).send('No se subió ninguna foto.');
  res.json({ photoUrl: `/public/photoCows/${req.file.filename}` }); // Devuelve la ruta de la foto
});

// Evento cuando un cliente se conecta
io.on('connection', (socket) => {

  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  socket.on('configDevice', (data) => {
    console.log('Datos desde plataforma:', data);
    const deviceData =JSON.parse(data)
    io.emit('14849484', deviceData.status);
    console.log('Enviando datos al dispositivo:', deviceData.status);
  });

});



server.listen(app.get('port'), function(){
    console.log("✅ My https server listening on port " + app.get('port') + "...");
  });
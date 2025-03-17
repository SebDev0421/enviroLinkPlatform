'use strict'

const { mongo } = require('mongoose')

const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const mongoose = require('./Database')
const port = (process.env.PORT || 3000)
const ProjectsRouter = require('./Routes/ProjectsRouter')

//Settings
app.set('port',port)

//middlewares

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


const staticPath = path.join(__dirname,'public/html/')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
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

app.get('/mapMonitoring',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'service.html'));
})




app.listen(app.get('port'), function(){
    console.log("My https server listening on port " + app.get('port') + "...");
  });
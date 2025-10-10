//imports
import express from "express";
import 'dotenv/config'
import { conectarBD } from "./config/db.js";



//Config
const app = express();
app.use(express.json());

//Routers


// Excecution
conectarBD().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Backend escuchando en http://${process.env.HOST_NAME}:${process.env.PORT}`)
    })
})
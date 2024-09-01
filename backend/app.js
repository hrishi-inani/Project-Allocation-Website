import dotenv from "dotenv";
dotenv.config({path:"config/.env"});

import express from "express";
const app = express();

import cookieParser from 'cookie-parser';


import cors from 'cors';
const corsOptions = {
    origin: `${process.env.FRONTENDURL}`, 
    // origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    credentials: true
  };
app.use(cors(corsOptions)); 


app.use(express.json());


//mongoose connection
import connectDatabase from "./config/database.js"
connectDatabase();


// Middleware to parse cookies
app.use(cookieParser());

import authRouter from "./Views/msAuth.js";
app.use(authRouter)

import ProjectRouter from "./Views/projects.js";
app.use('/project',ProjectRouter);

import StudentRouter from "./Views/student.js";
app.use('/student',StudentRouter);

import UserRouter from "./Views/user.js";
app.use('/user',UserRouter);

app.listen(process.env.PORT, (req, res, err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server listening on PORT : ${process.env.PORT}`);
    }
})
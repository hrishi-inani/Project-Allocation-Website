import mongoose from "mongoose";

const database=()=>{
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL).then(
        (data)=>{
            console.log(`Connected with server Successfully on the port: ${data.connection.host}`)
        })
}

export default database;
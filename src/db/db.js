import mysql from "mysql"
import { ApiError } from "../utils/ApiError.js"

const sqlConnect = mysql.createConnection({
    host:'127.0.0.1',
    user:"root",
    password:"root123",
    database:"poll"
})

sqlConnect.connect((err)=>{
    if(err){
        throw new ApiError(501,"Error connecting to database")
    }
})

export const Connect = sqlConnect


import { app } from "./app.js";
import {Connect} from "./db/db.js"




app.listen(8000,(err)=>{
    if(err){
        console.log("Server error: " + err)
    }else{
        console.log("Server listening on ",8000)
    }
})

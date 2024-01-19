import { Connect } from "../db/db.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPoll  = asyncHandler(async(req,res)=>{

    //get values from req.body
    //apply INSERT into Polls 

    const {title,category,startDate,endDate,minReward,maxReward}=req.body
    if(!(title || category || startDate || endDate || minReward || maxReward)){
        throw new ApiError(401,"ALl fields must be required")
    }

    const sqlQuery = 'INSERT INTO Polls (title, category, startDate, endDate, minReward, maxReward) VALUES (?, ?, ?, ?, ?, ?)'
    const values = [title,category,startDate,endDate,minReward,maxReward]

    Connect.query(sqlQuery,values,(error,result)=>{
        if(error){
            throw new ApiError(501,"Error while creating Poll ",error)
            
        }else{
            // console.log(result)
          return  res.status(200).json(
                new ApiResponse(200,result,"Poll created successfully")
            )
        }
    })

        




})

const getPolls = asyncHandler(async(req,res)=>{

    const sqlQuery = 'SELECT * FROM Polls'

    Connect.query(sqlQuery,(error,result)=>{
        if(error){
            throw new ApiError(501,"Error while fetching polls")
        }else{
            return res.status(200).json(
                new ApiResponse(200,result,"All Polls fetched successfully")
            )
        }
    })

})

const updatePoll = asyncHandler(async(req,res)=>{

    //get pollId from params
    //get req.body fields
    //check exist or not
    //update req.body fields

    //NOTE:you have to sent all fields with their existing values and only update the updating fields
    const {pollId} = req.params
    const {title, category, startDate, endDate, minReward, maxReward}=req.body

    const sqlQuery = 'UPDATE Polls SET title = ?, category = ?, startDate = ?, endDate = ?, minReward = ?, maxReward = ? WHERE pollId = ?';
    const values = [title, category, startDate, endDate, minReward, maxReward, pollId];

    Connect.query(sqlQuery,values,(error,result)=>{
        if(error){
            throw new ApiError(501,"Error while updating Poll",error);
        }else{
            return res.status(200).json(
                new ApiResponse(200,result,"Poll updated")
            )
        }
    })


  
  

    

})








export {
    createPoll,
    getPolls,
    updatePoll,
}
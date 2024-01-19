import { Connect } from "../db/db.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//creating poll question for particular poll
const createQuestion = asyncHandler(async(req,res)=>{

    //get pollId from params
    //get fields from req.body
    //first check for pollId exist or not
    //add question to the table
    //add options to table

    const {pollId}  = req.params
    const {questionType,questionText,optionText} = req.body

    if(!(questionText || questionType || optionText)){
        throw new ApiError(401,"All fields required")
    }

    const sqlPollCheckQuery = 'SELECT * FROM polls WHERE pollId=?'
    Connect.query(sqlPollCheckQuery,[pollId],(error,result)=>{
        if(error){
            throw new ApiResponse(501,"Error while checking poll ",error)
        }
        else if(result.length===0){
            throw new ApiResponse(401,"Poll not found")
        }
        else{

            const sqlQuery = 'INSERT INTO Questions (pollId,questionType,questionText) VALUES (?,?,?)'
            const values= [pollId,questionType,questionText]

            Connect.query(sqlQuery,values,(error,result)=>{
                if(error){
                    throw new ApiError(501,"Error while creating question: " + error)
                }else{

                    //store optionss
                    const questionId = result.insertId;
                    console.log(optionText)
                    const sqlOptionQuery = 'INSERT INTO options (questionId,optionText) VALUES ?;'
                    const optionValues = optionText.map((i)=>[questionId,i])

                    Connect.query(sqlOptionQuery,[optionValues],(error,result)=>{
                        if(error){
                            throw new ApiResponse(501,"Error while inserting options ",error)
                        }
                        else{
                            return res.status(
                                new ApiResponse(200,result,"Question with options created successfully")
                            )
                        }
                    })
                    
                    
                }
            })

        }
    })

})


const updateQuestion = asyncHandler(async(req,res)=>{

        //  questionId,pollId from params
        // req.body
        // first check pollId and questionId exist or not
        
        const {pollId,questionId} = req.params
        const {questionType,questionText,optionText} = req.body
        if(!(questionType || questionText || optionText || questionId || pollId)){
            throw new ApiError("401","All fields must be required")
        }

        const sqlQuery = 'select * from questions WHERE pollid =? AND questionId=?'
        Connect.query(sqlQuery,[pollId,questionId],(error,result)=>{
            if(error){
                throw new ApiError(500,"Error ",error)
            }
            else if(result.length===0){
                console.log("result ",result)
                throw new ApiError(401,"Question not found")
            }
            else{
                //update here question FIRST
                const updateQuery = 'UPDATE Questions SET questionText = ?, questionType = ? WHERE pollId = ? AND questionId = ?';
                  const updateValues = [questionText, questionType, pollId, questionId];

                  Connect.query(updateQuery,updateValues,(error,questionResult)=>{
                    if(error){
                        throw new ApiResponse(501,"Error while updating Question ",error)
                    }
                    else{

                        //update option here

                        //first del all option ==quetionId
                        const deleteOptionsQuery = 'DELETE FROM Options WHERE questionId = ?';
                        const deleteOptionsValues = [questionId];

                        Connect.query(deleteOptionsQuery, deleteOptionsValues,(error)=>{
                            if(error){
                                throw new ApiError(501,"Error while deleting option",error);
                            }else{

                                //now insert new options
                                const insertOptionsQuery = 'INSERT INTO Options (questionId, optionText) VALUES ?';
                                  const insertOptionsValues = optionText.map((optionText) => [questionId, optionText]);

                                  Connect.query(insertOptionsQuery, insertOptionsValues,(error,Optionresult)=>{
                                    if(error){
                                        throw new ApiError(501,"Error inserting options: " + error)
                                    }else{
                                        return result.status(200).json(
                                            new ApiResponse(200,{questionResult,Optionresult},"question updated successfully")
                                        )
                                    }
                                  })

                                
                            }
                        })
                    }
                  })


            }
        })
       

    

})





export {
    createQuestion,
    updateQuestion,
}
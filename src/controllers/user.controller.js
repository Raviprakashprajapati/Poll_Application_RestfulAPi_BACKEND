import { asyncHandler } from "../utils/asyncHandler.js";
import { Connect } from "../db/db.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const fetchPollToUser = asyncHandler(async(req,res)=>{

    //get userId from req.params
    //check answer by user voting history
    //if users did not answer:server first poll question
    //if some voting done : server next unanswered question
    //if all question asnwerd: 'no new polls exist'
    

    const {userId} = req.params;

    // userVotingHistory 
     Connect.query('select pollId,questionId FROM userresponses WHERE userId=?',[userId],(error,result)=>{
        if(error) throw new ApiError(501,"Error ",error);
        else{

            //if zero answer 
            if(result.length===0)
            {

                //fetch polls that users has not participate
                Connect.query('SELECT p.pollId,p.title,p.startDate,p.endDate FROM polls p WHERE p.pollId NOT IN ( SELECT u.pollId FROM userResponses u WHERE u.userId=?  )',[userId],(err,result)=>{

                    if(err) throw new ApiError(501,"Error ",err)
                    else{
                        
                        if(result.length===0){
                            return res.status(200).json(
                                200,{message:"No new polls exist"},"no more polls exist"
                            )
                        }

                        //server FIRST POLL now
                        Connect.query(" SELECT q.questionId, q.questionType, q.questionText FROM questions q WHERE q.pollId =? AND q.questionId NOT IN ( SELECT u.questionId FROM userResponses u  WHERE u.userId=? AND u.pollID=? LIMIT 1  ); ",[result[0].pollId,userId,result[0].pollId],(err,Finalresult)=>{
                            if(err) throw new ApiError(500,"Error ",err)

                            else{

                                if(Finalresult.length===0){
                                    return res.status(200).json(
                                        new ApiResponse(200,{message:'No more questions found in first poll'})
                                    )
                                }

                                //finally send first question
                                return res.status(200).json(
                                    new ApiResponse(
                                        200,
                                        {
                                            pollId:result[0].pollId,
                                            pollTitle:result[0].title,
                                            questionId:result[0].questionId,
                                            questionType:result[0].questionType,
                                            questionText:result[0].questionText,

                                        },
                                        "Question Fetched Successfully"
                                    )
                                )

                            }

                        })

                
                    }

                });





            }            
            
            
        }
    })

    


    


    

    
    

})


const submitPollOfUser = asyncHandler(async(req,res)=>{

    // get {userId,pollId}
    //once SUbmit,UPDATE user by qestionId and pollId to userResponses
    //calculate reward
    //UPDATE PollAnalytics by totalVOtes ,optionCounts by WHERE pollId=?
    //RESPONSE:send rewards

    const {userId,pollId,questionId,chosenOptions} =req.body
    if(!(userId || pollId || chosenOptions || questionId)){
        throw new ApiError(401,"ALl fields required")
    }
    
    //INSERT into userResponses
    Connect.query('INSERT INTO userResponses (userId,pollId,questionId,chosenOptions) VALUES (?,?,?,?);',[userId,pollId,questionId,chosenOptions],(err,userResponsesResult)=>{
        if(!userResponsesResult){
            throw new ApiResponse(501,"Error while processing ",err)
        }

        //calulate the reward
        const rewardAMount = Math.floor(Math.random()*(60-20+1))+20;

        //store PollAnalytics for the poll
        Connect.query('UPDATE PollAnalytics SET totalVotes=totalVotes+1 WHERE pollId=?', [pollId],(err,analyticsResult)=>{
            if(err){
                throw new ApiResponse(501,"Error updating poll analytics ",err)
            }

            //upadte optionCount now
            Connect.query('SELECT optionCounts FROM pollAnalytics WHERE pollId=?',[pollId],(err,result)=>{
                if(err){
                    throw new ApiResponse(501,"Error updating poll analytics ",err)
                }

                let optionCount = result[0].optionCounts || '{}'
                optionCount = JSON.parse(optionCount)

                //update the count for chosen option
                optionCount[chosenOptions]=(optionCount[chosenOptions] || 0)+1

                //convert back to JSON 
                const updateOption = JSON.stringify(optionCount)

                Connect.query('UPDATE pollAnalytics SET optionCounts=? WHERE pollId=?',[pollId],(err,optionCountResult)=>{
                    if(err){
                        throw new ApiError(501,"Error while optionCount ",err)
                    }

                    return res.status(200).json(
                        new ApiResponse(200,{rewardAMount},"Poll submitted successfully")
                    )
                })
            })
           


        })


    })
    
    

})







export {
    fetchPollToUser,
    submitPollOfUser,
}
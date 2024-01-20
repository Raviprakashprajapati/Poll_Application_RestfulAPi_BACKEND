import { Connect } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const fetchPollAnalytics =asyncHandler(async(req,res)=>{

    //get pollId 
    const {pollId} = req.params
    if(!pollId) throw new ApiError(401,"PollId required")

    //fetch poll Analytics for specific poll
    Connect.query('SELECT * FROM PollAnalytics WHERE pollId=?',[pollId],(err,result)=>{
        if(err){
            throw new ApiError(501,"Error while fetching poll analytics ",er)
        }

        if(result.length===0){
            return res.status(200).json(
                new ApiResponse(200,null,"No ","no  polling questions")
            )
        }

        const {analyticsId,totalVotes,optionCouts}=result[0];
        

        return res.status(200).josn(
            
            new ApiResponse(200, {analyticsId,totalVotes,optionCouts:JSON.parse(optionCouts)} ,"")

        )

        
        
    })

})


const fetchOverallPollAnalytics = asyncHandler(async(req,res)=>{

    //fetch all polls
    //cal: total votes acros all polls
    //count each option selected arosss all polls

    Connect.query('SELECT COUNT(*) as totalPolls, SUM(totalVotes) as totalVotes  FROM POllAnalytics ',(err,analyticsResult)=>{
        if(err){
            throw new ApiError(501,"Error while fetching all polls ",err)
        }

        if(analyticsResult.length===0){
            return res.status(200).json(
                new ApiResponse(200,null,"No polls found")
            )
        }

        //fetch optionCounts for all polls
        Connect.query('SELECT optionCounts FROM POllanalytics',(err,result)=>{
            if(err){
                throw new ApiError(501,"Error while fetching all optionCounts ",err)
            }

            const aggregateOPtionalCounts = {}
            result.forEach((i)=>{

                const optionCounts = JSON.parse(i.optionCounts)

                Object.keys(optionCounts).forEach((option)=>{
                    aggregateOPtionalCounts[option] = (
                        aggregateOPtionalCounts[option] || 0
                    )+1
                })

            })

            return res.status(200).json(
                new ApiResponse(200,{totalPolls:analyticsResult[0].totalPolls,totalVotes:analyticsResult[0].totalVotes,aggregateOPtionalCounts},"Poll Analytics overrall result fetched successfully")
            )


        })
    })


})

export {
    fetchPollAnalytics,
    fetchOverallPollAnalytics,
}
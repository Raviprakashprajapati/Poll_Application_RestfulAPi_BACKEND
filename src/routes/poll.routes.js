import { Router } from "express";
import { createPoll, getPolls, updatePoll } from "../controllers/poll.controllers.js";
import { createQuestion, updateQuestion } from "../controllers/question.controller.js";
import { fetchPollToUser, submitPollOfUser } from "../controllers/user.controller.js";
import { fetchOverallPollAnalytics, fetchPollAnalytics } from "../controllers/analytics.controller.js";
const router = Router()


//poll.controller.routes-
router.route("/create-poll").post(createPoll)
router.route("/get-polls").get(getPolls)
router.route("/update-poll/:pollId").put(updatePoll)


//question.controller.routes--
router.route("/create-question/:pollId").post(createQuestion)
router.route("/update-question/:questionId/poll/:pollId").put(updateQuestion)


//user
router.route("/fetch-polls/:userId").get(fetchPollToUser)
router.route("/submit-poll").put(submitPollOfUser)


//pollAnalytics
router.route("/poll-analytics").get(fetchPollAnalytics)
router.route("/all-analytics").get(fetchOverallPollAnalytics)


export default router;
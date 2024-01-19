import { Router } from "express";
import { createPoll, getPolls, updatePoll } from "../controllers/poll.controllers.js";
import { createQuestion, updateQuestion } from "../controllers/question.controller.js";
import { fetchPollToUser } from "../controllers/user.controller.js";
const router = Router()


//poll.controller.routes-
router.route("/create-poll").post(createPoll)
router.route("/get-polls").get(getPolls)
router.route("/update-poll/:pollId").put(updatePoll)


//question.controller.routes--
router.route("/create-question/:pollId").post(createQuestion)
router.route("/update-question/:questionId/poll/:pollId").put(updateQuestion)


//user
router.route("/fetch-polls").get(fetchPollToUser)


export default router;
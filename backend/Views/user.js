import dotenv from "dotenv";
dotenv.config({path:"config/.env"});

import express from "express";
import { createProf, sendFeedbackEmail } from "../Controllers/userController.js";
import checkProf from "../Middlewares/checkProf.js";

const router = express.Router();

router.get("/feedback", sendFeedbackEmail);
router.post("/createprof",checkProf, createProf);

const user = router;
export default user;
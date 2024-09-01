import dotenv from "dotenv";
dotenv.config({path:"config/.env"});

import express from "express";
import { getAllProjects, IncreaseStepsDone, checkStudentAlloted, findStepsDone, newStudent, partner, finalpartner, partnerRequest, sentRequest, uploadResume, uploadGradeCard, checkDocuments, uploadSignedCopy } from "../Controllers/projectController.js";
import { getallstudent } from "../Controllers/userController.js";

const router = express.Router();

router.get("/studentallprojects", getAllProjects);
router.get("/checkAlloted/:email", checkStudentAlloted);
router.get("/partnerrequest/:student", partnerRequest);

router.get("/sentrequest/:student", sentRequest);
router.post("/newstudent", newStudent);
router.get("/partner/:student/:partner", partner);
router.get("/finalpartner/:student/:partner", finalpartner);
router.get("/stepsdone/find/:email", findStepsDone);
router.get("/stepsdone/increase/:email", IncreaseStepsDone);
router.get("/getallstudents", getallstudent);

router.get("/documents/:email", checkDocuments)
// router.get("/signedcopy/:email", checkSignedCopy)

router.patch("/uploadgradecard/:email",uploadGradeCard)
router.patch("/uploadsignedcopy/:email", uploadSignedCopy)
router.patch("/uploadresume/:email", uploadResume)

const student = router;
export default student;
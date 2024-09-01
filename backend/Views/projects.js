import express from "express";
import { allotProject, deleteProject, deselectProject, downLoadAllStudentDetails, downLoadDetails, getAllProjects, getInterestedStudents, getOwnerDetails, getOwnerProjects, getProjectDetails, newProject, selectProject, updateProjectDetails } from "../Controllers/projectController.js";
import checkStudent from "../Middlewares/checkStudent.js";
import checkProf from "../Middlewares/checkProf.js";
const router = express.Router();


router.get("/profallprojects", checkProf, getAllProjects);
router.get("/projectSpecific/:id", getProjectDetails);
router.get("/ownerdetails/:id", getOwnerDetails);

router.get("/getInterestedStudents/:id", getInterestedStudents);
router.get("/interestedpeople/:email", checkProf, downLoadDetails);

router.get("/downloadAll", downLoadAllStudentDetails);

router.get("/selectProject/:id/:email", checkStudent, selectProject);
router.get("/deselectproject/:id/:email", checkStudent, deselectProject);
router.post("/newProject/:email",checkProf, newProject);
router.get("/specificProject/:email", checkProf, getOwnerProjects);
router.get("/allotProject/:id/:student/:partner", allotProject);

router.delete("/deleteProject/:id", checkProf, deleteProject);

router.patch("/updateProject/:id/:email", checkProf, updateProjectDetails);


const project = router;

export default project;
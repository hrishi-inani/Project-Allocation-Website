import express from "express"
import { profLogin, studentLogin, getToken, getInfo, logOut, getToken2, getInfoProf, logOutProf } from "../Controllers/msAuthController.js";
import { routes } from "../routes.js";
import checkProf from "../Middlewares/checkProf.js";
import checkStudent from "../Middlewares/checkStudent.js";

const authRouter = express.Router();
 
authRouter.get(routes.microsoft + "/prof", profLogin);
authRouter.get(routes.microsoft + "/student", studentLogin);

authRouter.get(routes.microsoft + "/getToken", getToken);
authRouter.get(routes.microsoft + "/getToken2", getToken2);

authRouter.get(routes.microsoft + "/getInfo", checkStudent, getInfo);
authRouter.get(routes.microsoft + "/getInfoProf", checkProf, getInfoProf);

authRouter.get(routes.microsoft + "/logout", logOut);
authRouter.get(routes.microsoft + "/logoutprof", logOutProf);

export default  authRouter ;
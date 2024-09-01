import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

import Project from "../Models/Project.js";
import Student from "../Models/Student.js";
import User from "../Models/User.js";

import { sendEmail } from "./userController.js";

import excelJS from "exceljs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const extract_projects = async (projects_array) => {
    var projects = [];

    for (var i = 0; i < projects_array.length; i++) {
        let project = await Project.findById(projects_array[i]).select("-password -seckey").lean();
        projects.push(project);
    }
    return projects;
}

//get specific projects
const getOwnerProjects = async (req, res) => {
    try{
        const email = req.params.email;

        const user = await User.findOne({ email });
    
        if (!user) {
            res.status(200).json({ msg: "User Not Found" });
        } else {
            const projects = user.projects_posted;
            const projects_array = await extract_projects(projects);
            res.status(200).json(projects_array);
        }
    }
    catch(err) {
        res.status(500).json({msg : err.message});
      }
};


//new project 
const newProject = async (req, res) => {
    try{
        const user_email = req.params.email;

        const isvaliD = await User.findOne({ email: user_email });

        if (!isvaliD) {
            res.status(400).json({ msg: "Not Allowed" });
        } else {
            var today = new Date();
            const d = new Date();

            function addZero(i) {
                if (i < 10) { i = "0" + i }
                return i;
            }

            let h = addZero(d.getHours());
            let m = addZero(d.getMinutes());
            let s = addZero(d.getSeconds());
            let time = h + ":" + m + ":" + s;
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var full = (today.getMonth() + 1) + " " + today.getDate() + ", " + today.getFullYear() + " " + time;
            let co_supervisor = "";
            if (req.body.co_supervisor) {
                co_supervisor = req.body.co_supervisor;
            }

            const newItem = await Project.create({
                title: req.body.title,
                brief_abstract: req.body.brief_abstract,
                co_supervisor: co_supervisor,
                specialization: req.body.specialization,
                ownerDetails: isvaliD._id,
                creation_date: date,
                creation_time: time,
                updation_date: "",
                updation_time: "",
                getfull: full,
                gradeCardRequired: req.body.gradeCardRequired,
                resumeRequired: req.body.resumeRequired,
            });
            await User.findByIdAndUpdate(isvaliD._id, { $push: { projects_posted: newItem._id } });
            res.status(200).json({ msg: "Success" });
        }
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}



//check student is alloted a project or not
const checkStudentAlloted = async (req, res) => {
    try {
        const email = req.params.email;

        const student = await Student.find({ email: email });

        let flag = false;

        if (student && student[0] && String(student[0].projectName) !== "000000000000000000000000") {
            flag = true;
        }

        if (flag) res.status(200).json({ id: String(student[0].projectName) });
        else res.status(202).json({ msg: "not registered" });
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
    
};


//register a new student
const newStudent = async (req, res) => {
    try {
        const isValid = await Student.findOne({ email: req.body.userEmail });

        if (!isValid) {
            await Student.create({
                name: req.body.userName,
                email: req.body.userEmail,
                rollNum: req.body.userRoll,
                projectName: '000000000000000000000000',
                partner: '000000000000000000000000',
                is_banned: false,
            });

            res.status(200).json({ msg: "Success" });
        }
        else res.status(202).json({ msg: "already there" });
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//partner request
const partner = async (req, res) => {
    try {
        const studentEmail = req.params.student;
        const partnerEmail = req.params.partner;

        const student = await Student.findOne({ email: studentEmail });
        const partner = await Student.findOne({ email: partnerEmail });

        if(!student) res.status(401).json({ msg: "student not logged in" });
        else if (String(student.partner) !== "000000000000000000000000") res.status(403).json({ msg: "Already have partner" });
        else if (!partner) res.status(402).json({ msg: "partner does not exist" });
        else if (String(partner.partner) !== "000000000000000000000000") res.status(404).json({ msg: "partner has a partner" });
        else 
        {
            await Student.findOneAndUpdate({ email: studentEmail }, { $addToSet : { pendingRequests : partnerEmail} });
            await Student.findOneAndUpdate({ email: partnerEmail }, { $addToSet : { receivedRequests : studentEmail} });
            
            const subject = `Received request for BTech Project (BTP-398)`;
            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">You have received a request from ${student.name} to collaborate for BTech Project.</p>
                <p style="font-size: 16px;">Please click the link below to view the request:</p>
                <a href="${process.env.FRONTENDURL}/btp/student" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px;">View Request</a>
                <p style="font-size: 16px;">Login to the website and click on 'My Partner' to see the request received.</p>
            </div>
            `;

            sendEmail(partnerEmail, body, subject);


            res.status(200).json({ msg  : "sent successfully"});
        }
        
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const finalpartner = async (req, res) => {
    try {
        const studentEmail = req.params.student;
        const partnerEmail = req.params.partner;

        const student = await Student.findOne({ email: studentEmail });
        const partner = await Student.findOne({ email: partnerEmail });

        if (String(student.partner) !== "000000000000000000000000") res.status(403).json({ msg: "Already have partner" });
        else if (String(partner.partner) !== "000000000000000000000000") res.status(404).json({ msg: "partner has a partner" });
        else 
        {
            await Student.findOneAndUpdate({ email: studentEmail }, { $set : { partner : partner._id} }, { $inc: { stepsDone: 1 } });
            await Student.findOneAndUpdate({ email: partnerEmail }, { $set : { partner : student._id} }, { $inc: { stepsDone: 1 } });

            const subject = `Partner alloted for BTech Project (BTP-398)`;

            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">You and ${partner.name} are now partners for BTech Project.</p>
                <p style="font-size: 16px;">Please click the link below to view available projects and apply:</p>
                <a href="${process.env.FRONTENDURL}/btp/student" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px;">Apply for Projects</a>
                <p style="font-size: 16px;">Login to the website and apply for the projects available.</p>
            </div>
            `;

            sendEmail(studentEmail, body, subject);

            const body2 = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">You and ${student.name} are now partners for BTech Project.</p>
                <p style="font-size: 16px;">Please click the link below to view available projects and apply:</p>
                <a href="${process.env.FRONTENDURL}/btp/student" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px;">Apply for Projects</a>
                <p style="font-size: 16px;">Login to the website and apply for the projects available.</p>
            </div>
            `;

sendEmail(partnerEmail, body, subject);


            sendEmail(partnerEmail, body2, subject);

            res.status(200).json({ msg  : "sent successfully"});
        }
        
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const partnerRequest = async (req, res) => {
    try {
        const studentEmail = req.params.student;

        const student = await Student.findOne({ email : studentEmail});
        res.status(200).json(student.receivedRequests);
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const sentRequest = async (req, res) => {
    try {
        const studentEmail = req.params.student;

        const student = await Student.findOne({ email : studentEmail});
        res.status(200).json(student.pendingRequests);
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

//get owner details
const getOwnerDetails = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);

    if (!project) {
        res.status(404).json({ msg: "Not Found" });
    } else {

        const user = await User.findById(String(project.ownerDetails));

        if (!user) {
            res.status(403).json({ msg: "Owner Not Found" });
        } else {
            res.status(200).json(user);
        }
    }
};

//get interested students in a project
const getInterestedStudents = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Project.findById(id);
        const interestedStudents = project.interestedPeople;
        let array = [];

        if (interestedStudents) {
            for (let i = 0; i < interestedStudents.length; i++) {
                const student = await Student.find({ email: interestedStudents[i] });
                array.push(student[0].email);
            }
        }
        res.status(200).json(array);
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


const getProjectDetails = async (req, res) => {
    try
    {
        const id = req.params.id;
        const project = await Project.findById(id);

        if (!project) {
            res.status(404).json({ msg: "Not Found" });
        } else {
            res.status(200).json(project);
        }
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
    
};

//find steps done by a student
const findStepsDone = async (req, res) => {
    try {
        const email = req.params.email;

        const student = await Student.find({ email: email });
        const ans = student ? student[0].stepsDone : 0;

        res.status(200).json({ ans: ans });
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


//increase steps done by a student
const IncreaseStepsDone = async (req, res) => {
    try {
        const id = req.params.email;

        const student = await Student.findOneAndUpdate(
            { email: id },
            { $inc: { stepsDone: 1 } }, // Increment stepsDone by 1
            { new: true } // Return the updated document
        );
        const partner = await Student.findByIdAndUpdate(
            student.partner,
            { $inc: { stepsDone: 1 } }, // Increment stepsDone by 1
            { new: true } // Return the updated document
        );

        if (!student || !partner) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({student, partner});
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


//select a project
const selectProject = async (req, res) => {
    try {
        const email = req.params.email;

        const student = await Student.findOne({ email: email });
        const partnerId = student.partner;

        const pId = req.params.id;
        const project = await Project.findById(pId);


        if(!student || (project.gradeCardRequired && student.gradeCardUrl === ""))
        {
            return res.status(406).json({msg : "Grade card not uploaded of user"})
        }

        if (String(student.partner) === "000000000000000000000000") {
            res.status(401).json({ "msg": "Please Select A Partner" });
        }

        else {
            const partner = await Student.findById(partnerId);

            if(!partner || (project.gradeCardRequired && partner.gradeCardUrl === ""))
        {
            return res.status(407).json({msg : "Grade card not uploaded of partner"})
        }

            const owner = await User.findById(project.ownerDetails);
            if(!owner)
            {
                return res.status(402).json({msg : "owner not found"})
            }
            const ownerEmail = owner.email;

            if (project.interestedPeople.length !== 0) {
                res.status(402).json({ msg: "Project Already Allotted." });
            }
            else {
                if (student && String(student.projectName) !== "000000000000000000000000") {
                    res.status(403).json({ msg: "Project Already Allotted To You." });
                }
                else if (partner) {
                    if (String(partner.projectName) !== "000000000000000000000000") {
                        res.status(404).json({ msg: "Project Already Allotted To Partner." });
                    }
                    else {
                        if (student && project && partner) {
                            await Student.findByIdAndUpdate(student._id, { $push: { interestedLength: project._id } }, { $inc: { stepsDone: 1 } } );
                            await Student.findByIdAndUpdate(partner._id, { $push: { interestedLength: project._id } }, { $inc: { stepsDone: 1 } });

                            await Project.findByIdAndUpdate(project._id, { $push: { interestedPeople: student.email } });
                            await Project.findByIdAndUpdate(project._id, { $push: { interestedPeople: partner.email } });
                        }

                        const subject = `BTP-398`;
                        const body = `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <p style="font-size: 16px;">Hello,</p>
                            <p style="font-size: 16px;">User with names: ${student.name} and ${partner.name} has registered for the project: ${project.title.slice(0, 20)}.</p>
                            <p style="font-size: 16px;">Please click the link below to log in and view the project:</p>
                            <a href="${process.env.FRONTENDURL}/login" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px;">Login to Website</a>
                            <p style="font-size: 16px;">Kindly login to the website and open the project to view user/group details.</p>
                        </div>
                        `;

                        sendEmail(ownerEmail, body, subject);

                        res.status(200).json({ msg: "Success" });
                    }
                } else {
                    res.status(500).json({ msg: "Partner Not Exists" });
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};



const updateProjectDetails = async (req, res) => {
    const project_id = req.params.id;
    const isProject = await Project.findById(project_id);

    if (!isProject) {
        res.status(400).json({ "msg": "failure" });
    } else {
        const user = req.params.email;
        const isUser = await User.findOne({ email: user });

        if (!isUser) {
            res.status(401).json({ msg: "User Not Exist" });
        } else if (String(isProject.ownerDetails) !== String(isUser._id)) {
            res.status(403).send("This Item Doesn't Belongs to You.");
        } else {
            let title = isProject.title;
            let brief_abstract = isProject.brief_abstract;
            let co_supervisor = "";
            let specialization = isProject.specialization;

            if (isProject.co_supervisor) {
                co_supervisor = isProject.co_supervisor;
            }

            if (req.body.title) {
                title = req.body.title;
            }
            if (req.body.brief_abstract) {
                brief_abstract = req.body.brief_abstract;
            }
            if (req.body.co_supervisor) {
                co_supervisor = req.body.co_supervisor;
            }
            if (req.body.specialization) {
                specialization = req.body.specialization;
            }

            var today = new Date();
            const d = new Date();

            function addZero(i) {
                if (i < 10) { i = "0" + i; }
                return i;
            }

            let h = addZero(d.getHours());
            let m = addZero(d.getMinutes());
            let s = addZero(d.getSeconds());
            let time = h + ":" + m + ":" + s;
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var full = (today.getMonth() + 1) + " " + today.getDate() + ", " + today.getFullYear() + " " + time;

            let updation_date = date;
            let updation_time = time;

            const updation_project = await Project.findByIdAndUpdate(isProject._id, {
                title: title,
                brief_abstract: brief_abstract,
                co_supervisor: co_supervisor,
                specialization: specialization,
                updation_date: updation_date,
                updation_time: updation_time,
            });

            res.status(200).json({ msg: "success" });
        }
    }
}

const deleteProject = async (req, res) => {
    
    const pId = req.params.id

    const project = await Project.findById(pId);

    const user = await User.findById(project.ownerDetails);
    
    if (!project) {
        res.status(404).json({ msg: "Not Found" });
    } else {
        if (project.interestedPeople.length !== 0) {
            const stud1 = await Student.find({ email: project.interestedPeople[0] });
            const stud2 = await Student.findOne({ email: project.interestedPeople[1] });
            await Student.findOneAndUpdate({ email: project.interestedPeople[0] }, { projectName: "000000000000000000000000", partner: "000000000000000000000000" });
            await Student.findOneAndUpdate({ email: project.interestedPeople[1] }, { projectName: "000000000000000000000000", partner: "000000000000000000000000" });
            await Project.findByIdAndUpdate(project._id, { $pull: { interestedPeople: stud1.email } });
            await Project.findByIdAndUpdate(project._id, { $pull: { interestedPeople: stud2.email } });
        }

        await Project.findByIdAndDelete(pId);
        await User.findByIdAndUpdate(user._id, { $pull: { projects_posted: project._id } });
        res.status(200).json({ msg: "Success" });
    }
};


//de select a project
const deselectProject = async (req, res) => {
    const email = req.params.email;

    const pId = req.params.id;
    const project = await Project.findById(pId);

    if (project) {
        if (project.interestedPeople.length === 0) {
            res.status(401).json({ msg: "Project not alloted yet." });
        } else {
            const user = await Student.findOne({ email: email });

            if (!user) res.status(402).json({ msg: "User dont exist." });
            else {
                if (project && user) {
                    const partner = await Student.findById(user.partner);
                    await Project.findByIdAndUpdate(project._id, { $pull: { interestedPeople: user.email } });
                    Project.findByIdAndUpdate(project._id, { $pull: { interestedPeople: partner.email } });
                    res.status(200).json({ msg: "Success" });
                }
            }
        }
    } else {
        res.status(500).json({ msg: "Failure" });
    }
};


const allotProject = async (req, res) => {
    const id = req.params.id;
    await Project.findByIdAndUpdate(id, { interestedPeople: [] });
    const project = await Project.findById(id);

    const owner_id = String(project.ownerDetails);
    const owner = await User.findById(owner_id);
    const ownerEmail = owner.email;
    const ownerName = owner.name;

    const student1 = await Student.find({ email: req.params.student });
    const student2 = await Student.find({ email: req.params.partner });

    if (student1[0]) {
        for (let i = 0; i < student1[0].interestedLength.length; i++) {
            await Project.findByIdAndUpdate(student1[0].interestedLength[i], { $pull: { interestedPeople: student1[0].email } });
        }
    }

    if (student2[0]) {
        for (let i = 0; i < student2[0].interestedLength.length; i++) {
            await Project.findByIdAndUpdate(student2[0].interestedLength[i], { $pull: { interestedPeople: student2[0].email } });
        }
    }

    const addtostudu1 = await Student.findByIdAndUpdate(student1[0]._id, { projectName: project._id }, { $inc: { stepsDone: 1 } });
    const addtostudu2 = await Student.findByIdAndUpdate(student2[0]._id, { projectName: project._id }, { $inc: { stepsDone: 1 } });
    const addtointrestedpeople = await Project.findByIdAndUpdate(project._id, { $push: { interestedPeople: student1[0].email } });
    const addtointrestedpeople2 = await Project.findByIdAndUpdate(project._id, { $push: { interestedPeople: student2[0].email } });
    await Project.findByIdAndUpdate(project._id, { is_banned: true });

    await Student.findByIdAndUpdate(student1[0]._id, { interestedLength: [] });
    await Student.findByIdAndUpdate(student2[0]._id, { interestedLength: [] });

    const subject = `BTP-398`;

    // Email body for student 1
    const body1 = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p style="font-size: 16px;">Dear ${student1[0].name},</p>
        <p style="font-size: 16px;">${ownerName} (id: ${ownerEmail}) has approved your request to register for project ${project.title}.</p>
        <p style="font-size: 16px;">Therefore, you are registered for the project and can't select any other project.</p>
        <p style="font-size: 16px;">Your partner is ${student2[0].name} (id: ${student2[0].email}).</p>
        <p style="font-size: 16px;">You can check the details on the website.</p>
    </div>
    `;

    // Email body for student 2
    const body2 = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p style="font-size: 16px;">Dear ${student2[0].name},</p>
        <p style="font-size: 16px;">${ownerName} (id: ${ownerEmail}) has approved your request to register for project ${project.title}.</p>
        <p style="font-size: 16px;">Therefore, you are registered for the project and can't select any other project.</p>
        <p style="font-size: 16px;">Your partner is ${student1[0].name} (id: ${student1[0].email}).</p>
        <p style="font-size: 16px;">You can check the details on the website.</p>
    </div>
    `;

    // Send emails
    sendEmail(student1[0].email, body1, subject);
    sendEmail(student2[0].email, body2, subject);


    res.status(200).json({ msg: "allotted" });
};

const interestedPeople = async (arrayOfProjects) => {
    var result = [];

    if (arrayOfProjects) {
        for (let i = 0; i < arrayOfProjects.length; i++) {
            var student = [];
            const project = await Project.findById(arrayOfProjects[i]);
            if (project) {
                for (let j = 0; j < 2; j++) {
                    let people2 = await Student.find({ email: project.interestedPeople[j] });
                    people2.project_name = project.title;

                    student.push(people2);
                }
            }
            result.push(student);
        }
    }
    return result;
}

const uploadGradeCard = async (req, res) => {
    try{
        const url = req.body.url2;
        const email = req.params.email;

        const student = await Student.findOneAndUpdate({ email : email}, { gradeCardUrl : url }, { $inc: { stepsDone: 1 } } );
        res.status(200).json({msg : "grade card upload success"})
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const uploadResume = async (req, res) => {
    try{
        const url = req.body.url2;
        const email = req.params.email;

        const student = await Student.findOneAndUpdate({ email : email}, { resumeUrl : url });
        res.status(200).json({msg : "resume upload success"})
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const uploadSignedCopy = async (req, res) => {
    try{
        const url = req.body.url2;
        const email = req.params.email;

        const student = await Student.findOneAndUpdate({ email : email}, { $inc: { stepsDone: 1 } });
        const partner = await Student.findOneAndUpdate(student.partner, { $inc: { stepsDone: 1 } });
        const project = await Project.findByIdAndUpdate( student.projectName, { signedCopy : url });
        res.status(200).json({msg : "resume upload success"})
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const checkDocuments = async (req, res) => {
    try{
        const email = req.params.email;

        const student = await Student.findOne({ email : email});

       if(student.gradeCardUrl !== "" && student.resumeUrl !== "")
        res.status(200).json({msg : "Both uploaded"})
        else if(student.gradeCardUrl !== "")
        res.status(201).json({msg : "Only resume uploaded"})
        else if(student.resumeUrl !== "")
        res.status(202).json({msg : "Only cv uploaded"})
        else 
        res.status(203).json({msg : "nothing uploaded"})
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


const downLoadDetails = async (req, res, next) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    const user = req.params.email;
    const isValidUser = await User.findOne({ email: user });
    var path = __dirname + `/public/student_data.xlsx`;

    worksheet.columns = [
        { header: "S no.", key: "s_no", width: 10 },
        { header: "Project Name", key: "pname", width: 30 },
        { header: "Student 1 Name", key: "name1", width: 20 },
        { header: "Student 1 Roll", key: "roll1", width: 15 },
        { header: "Student 1 ID", key: "id1", width: 20 },
        { header: "Student 2 Name", key: "name2", width: 20 },
        { header: "Student 2 Roll", key: "roll2", width: 15 },
        { header: "Student 2 ID", key: "id2", width: 20 },
    ];

    let counter = 1;
    if (isValidUser) var arrayOfProjects = isValidUser.projects_posted;
    var details = await interestedPeople(arrayOfProjects);

    if (details) {
        details.forEach((entry) => {
            worksheet.addRow({
                s_no: counter,
                pname: entry[0].project_name,
                name1: entry[0][0] ? entry[0][0].name : "",
                roll1: entry[0][0] ? entry[0][0].rollNum : "",
                id1: entry[0][0] ? entry[0][0].email : "",
                name2: entry[0][0] ? entry[1][0].name : "",
                roll2: entry[0][0] ? entry[1][0].rollNum : "",
                id2: entry[0][0] ? entry[1][0].email : "",
            });
            counter++;
        });
    }

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    const data = await workbook.xlsx.writeFile(path);
    res.status(200).download(path);
};

const downLoadAllStudentDetails = async (req, res, next) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    var path = __dirname + `/public/student_data.xlsx`;

    worksheet.columns = [
        { header: "S no.", key: "s_no", width: 10 },
        { header: "Project Name", key: "pname", width: 30 },
        { header: "Student 1 Name", key: "name1", width: 20 },
        { header: "Student 1 Roll", key: "roll1", width: 15 },
        { header: "Student 1 ID", key: "id1", width: 20 },
        { header: "Student 2 Name", key: "name2", width: 20 },
        { header: "Student 2 Roll", key: "roll2", width: 15 },
        { header: "Student 2 ID", key: "id2", width: 20 },
    ];

    let counter = 1;
    
    const arrayOfProjects = await Project.find();
    const arrayOfId = []; 

    for(let i=0; i < arrayOfProjects.length; i++)
    {
        arrayOfId.push(arrayOfProjects[i]._id);
    }
    
    var details = await interestedPeople(arrayOfProjects);

    if (details) {
        details.forEach((entry) => {
            worksheet.addRow({
                s_no: counter,
                pname: entry[0].project_name,
                name1: entry[0][0] ? entry[0][0].name : "",
                roll1: entry[0][0] ? entry[0][0].rollNum : "",
                id1: entry[0][0] ? entry[0][0].email : "",
                name2: entry[0][0] ? entry[1][0].name : "",
                roll2: entry[0][0] ? entry[1][0].rollNum : "",
                id2: entry[0][0] ? entry[1][0].email : "",
            });
            counter++;
        });
    }

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    const data = await workbook.xlsx.writeFile(path);
    res.status(200).download(path);
};

export {
    getAllProjects, checkStudentAlloted, newStudent, getOwnerDetails, getInterestedStudents, findStepsDone, IncreaseStepsDone, selectProject, deselectProject, getOwnerProjects, newProject, getProjectDetails, downLoadDetails, updateProjectDetails, deleteProject,
    partner, partnerRequest, sentRequest, finalpartner, uploadGradeCard, uploadResume, checkDocuments, allotProject, downLoadAllStudentDetails, uploadSignedCopy
}
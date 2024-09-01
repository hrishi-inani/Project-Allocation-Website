import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rollNum: { type: String, required: true },
    projectName: { type: mongoose.Schema.Types.ObjectId, default: "000000000000000000000000" },
    interestedLength: [{ type: String, default: [] }],
    partner: { type: mongoose.Schema.Types.ObjectId, default: "000000000000000000000000" },
    is_banned: { type: Boolean, required: true, default: false },
    is_admin: { type: Boolean, required: true, default: false },
    role: { type: String, required: true, default: "stud" },
    project_name: { type: String, default: "" },
    partner_name: { type: String, default: "" },
    stepsDone:  { type: Number, default: 0},
    gradeCardUrl: { type: String, default: ""},
    resumeUrl: { type: String, default: ""},
    receivedRequests: { type: Array, default: [] },
    pendingRequests: { type: Array, default: [] },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;

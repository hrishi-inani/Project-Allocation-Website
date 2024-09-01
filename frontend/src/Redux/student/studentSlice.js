import { createSlice } from "@reduxjs/toolkit"
var _ = require('lodash');

const initialState = {
    studentInfo: [],
    intrestedPeople:[],
    partnerDetails:"",
    studentProject:"",
    allStudents:[],
    partnerRequests:[],
    sentRequests:[],
}

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers:{
        setPartnerRequestsRedux(state,action){
            return {
                ...state,
                partnerRequests: action.payload
              };
        },
        setSentRequestsRedux(state,action){
            return {
                ...state,
                sentRequests: action.payload
              };
        },
        setStudentInfo(state,action){
            return {
                ...state,
                studentInfo: action.payload
              };
        }, 
        addStudent(state,action){
            return {
                ...state,
                intrestedPeople: action.payload
              };
        },     
        removeStudent(state,action){
            
            state.intrestedPeople=[];
        }, 
        addPartner(state,action){
            const index = state.specificProjects.findIndex(item => item.id === action.payload);
            state.specificProjects.slice(index, 1);
        }, 
        setAllStudents(state,action){
            return {
                ...state,
                allStudents: action.payload
              };
        }, 
    }
})
export const {setStudentInfo, addStudent, removeStudent, addProject, setAllStudents, setPartnerRequestsRedux, setSentRequestsRedux} = studentSlice.actions;

export default studentSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
var _ = require('lodash');

const initialState = {
    specificProjects : [],
    allProjects : [],
    interestedStudents : [],
}

const allprojectsSlice = createSlice({
    name:"allProjects",
    initialState,
    reducers:{
        setAllProjectsRedux(state,action){
            return {
                ...state,
                allProjects: action.payload
              };
        },    
        setSpecificProjects(state,action){
            return {
                ...state,
                specificProjects: action.payload
              };
        }, 
        setInterestedStudents(state,action){
            return {
                ...state,
                interestedStudents : action.payload
              };
        }, 
        delProject(state,action){
            const index = state.specificProjects.findIndex(item => item.id === action.payload);
            state.specificProjects.slice(index, 1);
        }
    }
})
export const {setAllProjectsRedux, setSpecificProjects, addProject, delProject, editProject, setInterestedStudents} = allprojectsSlice.actions;

export default allprojectsSlice.reducer;




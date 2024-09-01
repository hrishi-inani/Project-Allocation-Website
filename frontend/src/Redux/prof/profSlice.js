import { createSlice } from "@reduxjs/toolkit"
var _ = require('lodash');

const initialState = {
    ownerDetails:[],
    profInfo: []
}

const ownerSlice = createSlice({
    name:"prof",
    initialState,
    reducers:{
        setProfInfo(state,action){
            return {
                ...state,
                profInfo: action.payload
              };
        }, 
        setOwner(state,action){
            return {
                ...state,
                allProjects: action.payload
              };
        },     
        addOwner(state,action){
            state.ownerDetails.unshift(action.payload);
            state.allProjects.unshift(action.payload);
        }, 
        delOwner(state,action){
            const index = state.specificProjects.findIndex(item => item.id === action.payload);
            state.specificProjects.slice(index, 1);
        }, 
    }
})
export const { setOwner, addOwner, delOwner, setProfInfo } = ownerSlice.actions;

export default ownerSlice.reducer;




import { configureStore } from "@reduxjs/toolkit";
import allProjectsReducer from "./allProjects/allprojectsSlice";
import studentSlice from "./student/studentSlice";
import profSlice from "./prof/profSlice";

const store = configureStore({
    reducer:{
        allProjects : allProjectsReducer,   
        student:studentSlice,
        prof:profSlice
    }
})

export default store;
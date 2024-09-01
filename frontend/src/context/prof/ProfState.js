import React from "react";
import ProfContext from "./ProfContext";
import { setProfInfo } from "../../Redux/prof/profSlice";
import { useDispatch } from "react-redux";


const ProfState = (props) => {
    const url = process.env.REACT_APP_BACKEND_URL;

    const dispatch = useDispatch();


    const checkProfEligible = ( job, roll ) => {
        
        if (
        job === "Associate Professor" || 
        job === "ASSOCIATE PROFESSOR" || 
        job === "Assistant Professor" || 
        job === "ASSISTANT PROFESSOR" || 
        job === "Research Scholar" || 
        job === "REASEARCH SCHOLAR" || 
        job === "PROFESSOR" || 
        job === "Professor" || 
        roll === "210103016" ||
        roll ==="210103120"
        ) {
            return true;
        } 
        else {
            return false;
        }
    }

    const getProfDetailsFromMicrosoft = async () => {
        const response = await fetch(`${url}/auth/microsoft/getInfoProf`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
        });

        const json = await response.json();

        dispatch(setProfInfo(json));
        return response.status;
    }

    const createProf = async (email, name) => {
        const response = await fetch(`${url}/user/createprof`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ email, name})
        });

        return response.status;
    }


    const LogOut = async () => {
        const response = await fetch(`${url}/auth/microsoft/logoutprof`,{
            method: 'GET',
            credentials:'include',
            headers: { 
                'Context-Type': 'application/json'
            }
        })

        const tenantID = process.env.MICROSOFT_GRAPH_TENANT_ID;
        const logoutEndpoint = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.REACT_APP_FRONTEND_URL}`;
        window.location.href = logoutEndpoint;
    }

return (
    <ProfContext.Provider value={{ checkProfEligible, LogOut, getProfDetailsFromMicrosoft, createProf}}>
        {props.children}
    </ProfContext.Provider>
)
}

export default ProfState;
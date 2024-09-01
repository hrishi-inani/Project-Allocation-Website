import { useState } from "react";
import AuthContext from "./AuthContext";
import { setStudentInfo } from "../../Redux/student/studentSlice";
import { useDispatch } from "react-redux";


const AuthState = (props) => {

    //states define for auth
    const [user,setUser]=useState([])
    const [interest,setInterest]=useState([])
    const dispatch = useDispatch();

    //local backend url for testing
    const url = process.env.REACT_APP_BACKEND_URL;

    //hosted backend url
    // const url = process.env.REACT_APP_BACKEND_URL;


    //prof login
    const ProfMicrosoftLogin = async()=>{
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/microsoft/prof`;
    }

    //student login
    const StudentMicrosoftLogin = async()=>{
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/microsoft/student`;
    }

    
    //send feedback both student and professor
    const sendFeedback = async (email, header, body)=>{
        const response = await fetch(`${url}/btp/feedback`, {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, header, body }),
        });
        return response.status;
    }


    //get project owner details
    const ownerdetails = async (id) => {
        const response = await fetch(`${url}/project/ownerdetails/${id}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json",
                'auth-token':localStorage.getItem('btpToken')
            }
        })
        const json=await response.json();

        //set user details in react redux
        setUser(json);

        return response.status;
    }


    //get a particular project details
    const projectdetails = async (id) => {
        const response = await fetch(`${url}/project/projectdetails/${id}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json",
                'auth-token': localStorage.getItem('btpToken')
            }
        })
        const json=await response.json();

        // save particular project in react-redux 
        setInterest(json);

        return response.status;
    }


    //dowload complete list of registered students
    const downloadDetails = async(email)=>{
        const response = await fetch(`${url}/project/interestedpeople/${email}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json'
            }
        })
        return response.status;
    }


    const getUserDetailsFromMicrosoft = async () => {
        const response = await fetch(`${url}/auth/microsoft/getInfo`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
        });

        const json = await response.json();

        dispatch(setStudentInfo(json));
        return response.status;
    }

    const LogOut = async () => {
        const tenantID = process.env.MICROSOFT_GRAPH_TENANT_ID;
        const logoutEndpoint = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.REACT_APP_FRONTEND_URL}`;
        window.location.href = logoutEndpoint;
    }
    

    return (<AuthContext.Provider value={{sendFeedback, ProfMicrosoftLogin, StudentMicrosoftLogin, ownerdetails, user, downloadDetails, interest, projectdetails, getUserDetailsFromMicrosoft, LogOut}}>
        {props.children}
    </AuthContext.Provider>
    )
}
export default AuthState;
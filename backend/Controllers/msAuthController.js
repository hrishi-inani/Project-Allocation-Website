import dotenv from "dotenv";
dotenv.config({path:"config/.env"});

import msal from '@azure/msal-node';
import fetch from "node-fetch";
import Student from "../Models/Student.js";
import Project from "../Models/Project.js";

const clientID = process.env.MICROSOFT_GRAPH_CLIENT_ID;
const tenantID = process.env.MICROSOFT_GRAPH_TENANT_ID;
const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;

const config = {
  auth: {
    clientId: clientID,
    authority: "https://login.microsoftonline.com/" + tenantID,
    clientSecret: clientSecret
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

const pca = new msal.PublicClientApplication(config);


//microsoft prof login
export const profLogin = async (req, res) => {
  const authCodeUrlParameters = {
    scopes: ['user.read'],
    redirectUri: `${process.env.BACKENDURL}/auth/microsoft/getToken2`,
  };

  const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);

  res.redirect(authUrl);
};

//microsoft student login
export const studentLogin = async (req, res) => {
  try{
    const authCodeUrlParameters = {
      scopes: ['user.read'],
      redirectUri: `${process.env.BACKENDURL}/auth/microsoft/getToken`,
    };

    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);

    res.redirect(authUrl);
  }
  catch(err) {
    res.status(500).json({msg : err.message});
  }
};



export const getToken = async (req,res) => {
  try{
    const code = req.query.code;

    const url = `https://login.microsoftonline.com/${tenantID}/oauth2/token`;
    const formData = new URLSearchParams();

    //formdata
    formData.append('client_id', clientID);
    formData.append('client_secret', clientSecret);
    formData.append('scope', "openid profile email");
    formData.append('redirect_uri', `${process.env.BACKENDURL}/auth/microsoft/getToken`);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('resource', "https://graph.microsoft.com");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    

    if (response.ok) {
      const data = await response.json();
    
      const accessToken=data.access_token;
      
      const url2 = 'https://graph.microsoft.com/v1.0/me';

      const response2 = await fetch(url2, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response2.ok) {
        const data = await response2.json();
        
        // Set access token as an HTTP cookie
        res.cookie('btp_student_accessToken', accessToken, { httpOnly: true, secure: true });

        // Redirect to frontend page
        const email = data.mail;

        const student = await Student.findOne({ email : email});

        if(!student)
        {
          return res.redirect(`${process.env.FRONTENDURL}/btp/student/document/upload`);
        }

        if(student.gradeCardUrl !== "" && student.resumeUrl !== "")
        res.redirect(`${process.env.FRONTENDURL}/btp/student/document/upload`);

        else if(student.gradeCardUrl === "")
        res.redirect(`${process.env.FRONTENDURL}/btp/student/upload`);

        else
        res.redirect(`${process.env.FRONTENDURL}/btp/student/projects`);
      } 
      else {
        throw new Error(await response2.text());
      }
      } 
      else {
        throw new Error(await response.text());
      }
    }
    catch(err) {
      res.status(500).json({msg : err.message});
    }
  };


export const getToken2 = async (req,res) => {
  try{
    const code = req.query.code;

    const url = `https://login.microsoftonline.com/${tenantID}/oauth2/token`;
    const formData = new URLSearchParams();

    //formdata
    formData.append('client_id', clientID);
    formData.append('client_secret', clientSecret);
    formData.append('scope', "openid profile email");
    formData.append('redirect_uri', `${process.env.BACKENDURL}/auth/microsoft/getToken2`);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('resource', "https://graph.microsoft.com");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    

    if (response.ok) {
      const data = await response.json();
    
      const accessToken=data.access_token;
      
      const url2 = 'https://graph.microsoft.com/v1.0/me';

      const response2 = await fetch(url2, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response2.ok) {
        const data = await response2.json();
        
        // Set access token as an HTTP cookie
        res.cookie('btp_prof_accessToken', accessToken, { httpOnly: true, secure: true });

        // Redirect to frontend page
        res.redirect(`${process.env.FRONTENDURL}/btp/prof/owner/projects`);
      } 
      else {
        throw new Error(await response2.text());
      }
      } 
      else {
        throw new Error(await response.text());
      }
    }
    catch(err) {
      res.status(500).json({msg : err.message});
    }
  };


export const getInfo = async (req, res) => {
  try{
    // Retrieve cookie value
    const accessToken = req.cookies.btp_student_accessToken;

    const url = 'https://graph.microsoft.com/v1.0/me';

    const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();

        res.status(200).json({ studInfo: data});
      } 
      else {
        res.status(401).json( { msg:'User not registered'});
      }
  }
  catch(err) {
    res.status(500).json({msg : err.message});
  }
    
  };


export const getInfoProf = async (req, res) => {
  try{
    // Retrieve cookie value
    const accessToken = req.cookies.btp_prof_accessToken;

    const url = 'https://graph.microsoft.com/v1.0/me';

    const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();

        res.status(200).json({ profInfo: data});
      } 
      else {
        res.status(401).json( { msg:'User not registered'});
      }
  }
  catch(err) {
    res.status(500).json({msg : err.message});
  }
    
  };


export const logOut = async (req, res) => {
  try{

    // Clear the cookie named 'btp_student_accessToken'
    res.clearCookie('btp_student_accessToken', { httpOnly: true, secure: true });
    
    // Redirect the user to the login page or any other appropriate route
    res.status(201).json({ msg : "Logged out successfully"});
  }
  catch(err) {
    res.status(500).json({msg : err.message});
  }
    
  };


export const logOutProf = async (req, res) => {
  try{

    // Clear the cookie named 'btp_student_accessToken'
    res.clearCookie('btp_prof_accessToken', { httpOnly: true, secure: true });
    
    // Redirect the user to the login page or any other appropriate route
    res.status(201).json({ msg : "Logged out successfully"});
  }
  catch(err) {
    res.status(500).json({msg : err.message});
  }
    
  };
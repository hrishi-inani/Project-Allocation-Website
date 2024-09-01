
import React, { useContext,useEffect, useState } from "react";
import {useParams,Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//import components
import ProjectContext from '../../../context/project/ProjectContext';
import AuthContext from '../../../context/auth/AuthContext';
import ProfDetails from './profDetails'
import ProjectCardSpecific from './specificProjectProjectcard';
import StudentContext from "../../../context/student/StudentContext";


const SpecificProjectComponent = () => {

    // get context
    const { details, getInterestedStudents, allProjectsStudent, getOwnerDetails} = useContext(ProjectContext);
    const { checkStudentEligible } = useContext(StudentContext);
    const { getUserDetailsFromMicrosoft, StudentMicrosoftLogin } = useContext(AuthContext);

    //redux information fetch
    const studentRegisteredList = useSelector(state => state.allProjects.interestedStudents);
    const items = useSelector(state => state.allProjects.allProjects);

    //define states
    const [allowed,setAllowed] = useState(false);
    const [loading,setLoading] = useState(true);
    const [random, setRandom] = useState(false);
    
    const params=useParams();
    const id = params.id;

    const Store = [];  
    Store.push(details);

    useEffect(() => {
      if(items.length === 0)getItem();

      getDetailsFunc();
  }, [random]);

    const getDetailsFunc = async () => {

      //get all interested student in the project
      const y = await getInterestedStudents(id);

      await getOwnerDetails(id);

      if(y === 200)
      {
        setLoading(false); 
        setAllowed(true);
      }   
    }

    const getItem = async () => {

      await getUserDetailsFromMicrosoft();

      //get all projects
      const x = await allProjectsStudent();
      if(x === 408)
      {
        await StudentMicrosoftLogin();
      }
      else if(x === 409 || x === 410)
      {
        setLoading(false); 
        setAllowed(false);
      }
      else 
      {
          setLoading(false); 
          setAllowed(true);
      }

      setRandom(true);
    }

    
    
    return(
      <div className=''>
        {loading 
        ?
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        :
        allowed
        ?
        <div>
          <header className="bg-gray-800 border-y border-gray-500 border-opacity-30 text-white py-2 flex items-center justify-center">
            <Link 
              className='' 
              to={`/btp/student/projects`}>
                <i className="fa-sharp fa-solid fa-arrow-left fa-lg pl-2 text-xl md:text-3xl" />
            </Link>
            
            <div className="flex items-center mx-auto px-2">
              <h1 className="text-sm md:text-xl font-bold text-center md:mr-20 font-Manrope">
                Kindy click on 'Register' if you are interested
              </h1>
            </div>
          </header>
          
          <div className="flex my-3 w-full mx-auto">
            <div className="mx-auto">
              {Store.map((detail,i) => {return (<ProfDetails key={i} detail={detail} />)})}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:pr-2">
            <div className='flex w-full justify-center md:pl-6 my-1 md:my-2'>
              {items.filter((project)=>project._id === id).map((projects,i) => {return (<ProjectCardSpecific key={i}/>)})}
            </div>

            <div className="md:w-1/4 flex flex-col items-center border-2 rounded-lg my-2 mx-2 md:ml-4 py-2">
              <div>
                <div className="font-medium text-lg px-3">Currently registered students :</div>
                {
                  loading
                  ?
                  <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                  :
                  <div className={"py-2 grid lowercase mx-2 " + (studentRegisteredList.length>0?"grid-cols-2":"grid-cols-1")}>
                  
                  { studentRegisteredList.length > 0 
                  ?
                  studentRegisteredList.map((individual) => {
                  return <div className="text-center text-xs bg-gray-200">{individual}</div>})
                  :
                  <div className="px-2 text-sm normal-case">No one has registered for this project (Refresh to reflect any changes)</div>}
                </div>}
              </div>
            </div>
          </div>
        </div>
        :
        <div className="w-full flex justify-center mt-8 md:mt-20">
            <div className="max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-4">404</h1>
                <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for could not be accessed by you.</p>
                <div className="bg-blue-500 text-center text-white text-xl font-bold py-2 px-4 rounded">
                    You are not part of this Course.
                </div>
            </div>
        </div>
      }
      </div>
    )
}
export default SpecificProjectComponent;

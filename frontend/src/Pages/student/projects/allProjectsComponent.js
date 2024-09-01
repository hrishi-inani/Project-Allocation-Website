import React, { useState, useContext, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import ProjectContext from '../../../context/project/ProjectContext';
import StudentContext from '../../../context/student/StudentContext';
import Projectcard from './allProjectsProjectcard.js';
import AuthContext from '../../../context/auth/AuthContext';
import CourseStructure from './courseStructure.js';

const AllProjectsComponent = () => {

    //context apis
    const { allProjectsStudent } = useContext(ProjectContext);
    const { getUserDetailsFromMicrosoft, StudentMicrosoftLogin } = useContext(AuthContext);
    const { createStudent, checkStudentAlloted, findStepDone, LogOut, getAllStudent } = useContext(StudentContext);
    
    //get details from redux store
    const items = useSelector((state) => state.allProjects.allProjects);
    const students = useSelector((state) => state.student.allStudents);
    const studentInfo = useSelector((state) => state.student.studentInfo);

    //react states
    const [mobileMenu, setMobileMenu] = useState(false);
    const [allowed, setAllowed] = useState(items.length > 0 ? true : false);
    const [loading, setLoading] = useState(items.length > 0 ? false : true);
    const [registered, setRegistered] = useState(false);
    const [projectId,setProjectId] = useState('');
    const [partner, setPartner] = useState('');
    const [flag, setFlag] = useState(false);
    const [random, setRandom] = useState(false);

    const [allotedProjects, setAllotedProjects] = useState([]);
    const [unAllotedProjects, setUnAllotedProjects] = useState([]);

    

    const sortProjects = () => {
        if(items && items.length > 0)
        {
            const allotedProjects = items.filter((item) => item.allotedPeople.length > 0);
            const unAllotedProjects = items.filter((item) => item.allotedPeople.length === 0);

            setAllotedProjects(allotedProjects)
            setUnAllotedProjects(unAllotedProjects)
        }
    }


    const getItem = async () => {

        await getUserDetailsFromMicrosoft();

        await getAllStudent();

       //get all projects
        const x = await allProjectsStudent();
        if(x === 408 || x === 410)
        {
            await StudentMicrosoftLogin();
        }
        else if(x === 409)
        {
            setLoading(false); 
            setAllowed(false);
        }
        else 
        {
            setLoading(false); 
            setAllowed(true);
        }

        //register a new student
        if (studentInfo && studentInfo.studInfo)
        {
            const x = await createStudent(
                studentInfo.studInfo.mail,
                studentInfo.studInfo.displayName,
                studentInfo.studInfo.surname
            );      
            
            if(x === 202) //already registered
            {
                checkAllotedFunc();
            }
        }

        setRandom(true);
    };

    const checkAllotedFunc = async () => {
        // using email to check user is registered to project or not
        if (studentInfo && studentInfo.studInfo)
        {
            const x = await checkStudentAlloted(studentInfo.studInfo.mail);

            if (x[0] === 200) 
            {
                setProjectId(x[1]);
                setRegistered(true);
            }
            else if( x === 400) setRegistered(false);
            else if(x === 401)
            {
                await LogOut();
            }
        }
    }


    useEffect(() => {
        
        //handler steps
        handlerNextWork();

        //handler sorting of projects
        sortProjects();

        getPartner();
        
        getItem();
    }, [random]);

    

    const getPartner = () => {
        if (students && students.length > 0 && studentInfo && studentInfo.studInfo)
        {
            const studId = students.filter((student) => student.email === studentInfo.studInfo.mail).map((student, i) => {
                return student._id;
            });

            var flag = false;

            const partner = students
                .filter((student) => student.partner === studId[0])
                .map((student, i) => {
                    flag = true;
                    return student;
                });

            setFlag(flag);
            setPartner(partner);
        }
    }
  

    const [search, setSearch] = useState('');
    const detectChanges = async (e) => {
        setSearch(e.target.value);
    };

    const [progress, setProgress] = useState(0);
    const [nextWork, setNextWork] = useState("");


    const works = [
        "Submit grade card(mandatory), or Resume(optional)",
        "Choose your partner (Note :- Send your partner a request from above link. Refrain from sending unwanted requests)",
        "Register for a project (Note :- You can register for multiple projects at a time but you will be alloted only one project)",
        "Allotment pending at professor end for one or more projects",
        "Upload signed copy of BTP-form of your alloted project at given link. Both partners have to fill their information and upload the signed copy.",
        "Done all."
    ]

    const handlerNextWork = async () => {
        const id = studentInfo ? studentInfo.studInfo ? studentInfo.studInfo.mail : "" : "";

        if(id !== "")
        {
            const x = await findStepDone(id);
        
            setProgress(x);
            setNextWork(works[x]);
        }
        else{
            setProgress(0);
            setNextWork(works[0]);
        }
    }


    return (
            <div className='overflow-x-hidden'>
                {loading 
                ?
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                </div>
                :
                <div>
                {allowed 
                ?
                <div>
                    <nav className="bg-gray-800 border-y border-gray-500 border-opacity-30 py-1 pr-0 md:pr-12">
                        <div className="max-w-7xl mx-auto px-0 lg:px-200">
                            <div className="relative flex items-center justify-between h-12">
                                <div className="flex items-center justify-start ml-2 md:ml-12 gap-2">
                                    <i className="fas fa-search text-xl text-white pr-2 h-full" />
                                    <div className="form-outline">
                                        <input
                                            id="search-input"
                                            type="search"
                                            className="outline-none rounded-md p-2"
                                            name='search'
                                            placeholder="Search by Title name"
                                            value={search}
                                            onChange={detectChanges}
                                            style={{
                                            width: "30vw",
                                            textAlign: "start",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                {!registered 
                                ?
                                <div
                                    className='text-xs md:text-lg py-1 px-1 md:px-2 bg-red-600 font-medium text-center text-white rounded-md mr-4'
                                >
                                    Not Alloted
                                </div>
                                :
                                <div
                                    className='text-xs md:text-lg py-1 px-1 md:px-2 bg-green-600 font-medium text-center text-white rounded-md mr-4'
                                >
                                    Alloted
                                </div>
                                }
            
                                
                                <div className='hidden md:flex'>
                                    {!registered 
                                    ?
                                    <div
                                        className="text-gray-500 px-3 py-2 rounded-md text-xl font-x-large"
                                    >
                                        <i
                                        className="fa-solid fa-book text-md pr-1"
                                        ></i>
                                        My Project
                                    </div>
                                    :
                                    <Link
                                        to={`/btp/student/projects/${projectId}`}
                                        className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-lg font-x-large"
                                    >
                                        <i
                                        className="fa-solid fa-book text-md pr-1"
                                        ></i>
                                        My Project
                                    </Link>}
                                    {flag
                                    ?
                                    <a
                                        href='#partner'
                                        className="text-gray-400 hover:text-white px-3 no-underline py-2 rounded-md text-lg font-x-large z-10 cursor-pointer"
                                    >
                                        <i
                                        className="fa-solid fa-userId text-md pr-1"
                                        ></i>
                                        My Partner
                                    </a>
                                    :
                                    <Link
                                        to={`/btp/student/partner`}
                                        className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-lg font-x-large"
                                    >
                                        <i
                                        className="fa-solid fa-user text-md pr-1"
                                        ></i>
                                        My Partner
                                    </Link>}
                                </div>
                                
                                <a
                                    href='#course'
                                    className="hidden md:flex text-gray-400 hover:text-white px-2 md:px-3 py-2 rounded-md text-xs  md:text-lg"
                                >
                                    About Course
                                </a>
            
                                {mobileMenu 
                                ?
                                <div
                                    className='flex md:hidden'
                                    onClick={() => setMobileMenu(false)}
                                    >
                                    <span className="material-symbols-outlined text-white text-xl ml-12 mr-2">
                                        cancel
                                    </span>
                                    </div>
                                :
                                <div
                                    className='flex md:hidden'
                                    onClick={() => setMobileMenu(true)}
                                    >
                                    <span className="material-symbols-outlined text-white text-xl md:ml-12 mr-2">
                                        menu_open
                                    </span>
                                    </div>
                                }
            
                                {mobileMenu
                                ?
                                <div className='flex flex-col md:hidden mt-12 z-10 border bg-white px-4 top-4 rounded-sm fixed right-8 cursor-pointer '>
                                    <a
                                        href={`/student/projects/${projectId}`}
                                        className='text-gray-600 no-underline hover:text-gray-700 py-2 border-b'
                                    >
                                        My Project
                                    </a>
                                    <a
                                        href='#partner'
                                        className='text-gray-600 hover:text-gray-700 py-2 border-b no-underline'
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        My Partner
                                    </a>
                                    <a
                                        href='#course'
                                        className='text-gray-600 no-underline hover:text-gray-700 py-2 border-b'
                                    >
                                        About Course
                                    </a>
                                </div>
                                :
                                ""
                                }
                                </div>
                            </div>
                        </div>
                    </nav>
        
                    <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-12 py-4 bg-gray-800 text-white">
                        <div className='flex-col'>
                            <h1 className="light text-2xl md:text-3xl">Welcome,</h1>
                            <h1 className="font-medium py-1 text-2xl md:text-3xl">
                                {studentInfo && studentInfo.studInfo ? studentInfo.studInfo.givenName : ""}
                            </h1>
                            <p className="text-sm md:text-lg">B.Tech. in Mechanical Engineering</p>
                        </div>
                        {/* <div className="w-full md:w-1/2 bg-gray-700 rounded-md p-4 overflow-hidden">
                            <div className='w-full rounded-lg h-4 border border-gray-400 border-opacity-40'>
                                <div className={`${progress === 5 ? "rounded-lg" : "rounded-l-lg"} h-4 bg-green-400`} style={{ width: `${(progress) * 20}%` }}></div>
                            </div>
                            <div className='w-full flex gap-4'>
                                <div
                                    className="flex justify-center items-center mt-4 px-4 py-2 bg-blue-500 text-white outline-none border-0 rounded-md"
                                >
                                    Progress- {progress*20}%
                                </div>
                                <div
                                    className="flex justify-center items-center mt-4 px-4 py-2 bg-orange-500 text-white outline-none border-0 rounded-md"
                                >
                                    Next- {nextWork}
                                </div>
                            </div>
                        </div> */}
                    </div>
        
                    {/* description */}
                    <div className="my-6 border px-4 md:px-12 py-5 rounded-md">
                        <div className="pb-2 flex gap-1 items-center">
                            <i className="fa fa-book fa-fw text-xl"></i> 
                            <div className='text-xl font-medium'>BTP Phase I</div>
                        </div>
                        <hr />
                        <h6 className="pt-2"> Description: </h6>
                        <p>No description provided.</p>
                        <div className="container"></div>
                    </div>
                    <div className="rounded-md my-4 ml-4 md:p-2 md:ml-12 w-2/3 md:w-1/3 bg-gray-100 p-2 text-gray-600" style={{'fontFamily':'Manrope'}}>
                        <div className="caption titled text-sm md:text-lg font-bold">
                        → Pay attention
                        <div className="top-links"></div>
                        </div>
                        <div>
                        <div className='text-center'>
                            <div className="text-sm md:text-lg">
                            Deadline to Register is 31st June, 2025 EOD
                            </div>
                            <br />
                        </div>
                        </div>
                    </div>

                    <hr/>
        
                    <div className='w-full flex justify-start py-4 px-8 text-white text-xl'>
                        <div className='px-4 py-2 rounded-md w-fit bg-green-600 bg-opacity-80'>Not Alloted till now ({unAllotedProjects.length})</div>
                    </div>
                    <div className='grid grid-cols-2 gap-2 md:gap-4 pt-4 pb-2 px-2 md:px-6 md:grid-cols-3 lg:grid-cols-5'>
                        {unAllotedProjects
                        .filter((items) => {
                            return search.toString().toLowerCase() === ""
                            ? items
                            : items.title.toLowerCase().includes(search.toLocaleLowerCase());
                        })
                        .map((project, i) => {
                            return <Projectcard key={i} project={project} />;
                        })}
                    </div>

                    <hr/>

                    <div className='w-full flex justify-start py-4 px-8 text-white text-xl'>
                        <div className='px-4 py-2 rounded-md w-fit bg-red-600 bg-opacity-80'>Alloted Projects ({allotedProjects.length})</div>
                    </div>
                    <div className='grid grid-cols-2 gap-2 md:gap-4 pt-4 pb-2 px-2 md:px-6 md:grid-cols-3 lg:grid-cols-5'>
                        {allotedProjects
                        .filter((items) => {
                            return search.toString().toLowerCase() === ""
                            ? items
                            : items.title.toLowerCase().includes(search.toLocaleLowerCase());
                        })
                        .map((project, i) => {
                            return <Projectcard key={i} project={project} />;
                        })}
                    </div>

                    <hr/>
        
                    <div id='partner' className="mx-auto pt-24 pb-12 text-gray-600">
                        <div className="max-w-md mx-auto shadow-md rounded-md bg-gray-100">
                        <div className="p-4">
                            <h2 className="text-2xl font-bold mb-2">Partner Details</h2>
                            <hr className="my-4" />
                            <div className="grid grid-cols-2 gap-x-20 md:gap-x-2 gap-y-2">
                            <div>
                                <label className="text-sm md:text-lg font-medium text-gray-700">Name:</label>
                                <p className="text-sm md:text-lg  font-semibold font-mono tracking-tighter md:tracking-tight">
                                {flag ? partner[0].name : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm md:text-lg font-medium text-gray-700 pl-5 md:pl-12">
                                Roll No:
                                </label>
                                <p className="text-sm md:text-lg font-semibold font-mono pl-5 md:pl-12">
                                {flag ? partner[0].rollNum : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm md:text-lg font-medium text-gray-700 ">Email:</label>
                                <p className="text-sm md:text-lg font-semibold font-mono tracking-tighter md:tracking-tight">
                                {flag ? partner[0].email : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 pl-5 md:pl-12">
                                Job:
                                </label>
                                <p className="text-sm md:text-lg font-semibold font-mono pl-5 md:pl-12 tracking-tighter md:tracking-tight">
                                BTech
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
        
                    <CourseStructure/>
        
                    <div
                        className="flex items-center pl-4 md:pl-24 lg:pl-48 bg-gray-200"
                        style={{
                            height: "15vh",
                            width: "100vw",
                            margin: "auto",
                            display: "flex",
                            alignprojects: "center",
                        }}
                    >
                        <svg
                        style={{ height: "30px", paddingRight: "10px" }}
                        className="MuiSvgIcon-root _add__comment_1ob32_146"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        >
                        <path
                            d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4zm-2 13.17L18.83 16H4V4h16v13.17zM13 5h-2v4H7v2h4v4h2v-4h4V9h-4z"
                        ></path>
                        </svg>
                        <p
                        className="_para__feedback_1ob32_130 text-xs md:text-sm lg:text-lg flex-wrap"
                        style={{
                            marginBottom: "0.5vw",
                            display: "flex",
                            alignContent: "center",
                        }}
                        hover={{ textDecoration: "underline" }}
                        >
                        We value your opinion, please take a moment to fill out our{" "}
                        <Link
                            className='px-1 text-blue-500 hover:underline'
                            to={`/btp/student/feedback`}
                        >
                            {" "}
                            feedback form{" "}
                        </Link>{" "}
                        to help us improve.
                        </p>
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
                </div>}
            </div>)
}
export default AllProjectsComponent;
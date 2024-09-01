import React,{useContext,useEffect,useState} from 'react';
import { Link,useParams } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import StudentContext from '../../../context/student/StudentContext';
import AuthContext from '../../../context/auth/AuthContext';

const SpecificProjectProjectcard = () =>{
  
    //context info fetch
    const { StudentMicrosoftLogin } = useContext(AuthContext);
    const { increaseStepDone } = useContext(StudentContext);
    const {selectproject, deselectproject, getInterestedStudents } = useContext(ProjectContext);
    

    //defined states
    const [studentRegisteredCount, setStudentRegisteredCount] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alloted, setAlloted] = useState(false);
    const [showModal, setShowModal] = useState(false);


    //get project id from params
    const params = useParams();
    const id = params.id;

    //redux info fetch
    const items = useSelector(state => state.allProjects.allProjects);
    const project = items.filter((project)=>project._id === id).map((project,i)=>{return project});
    const studentInfo = useSelector((state) => state.student.studentInfo);


    const checkStudentRegisteredCount = () => 
    {
      if(project && project[0] && project[0].interestedPeople)
      {
        project[0].interestedPeople.map((emailcheck) => 
          {
            setStudentRegisteredCount(studentRegisteredCount+1);
            const user = studentInfo.studInfo.mail;
            if(emailcheck === user)setIsRegistered(1);
          });
      }
      setLoading(false);
    }
    

    const getItem = async () => {

      //get single project
      const x = project;

      if(x){
        const isbanned = x.is_alloted;
        setAlloted(isbanned);
      }

      checkStudentRegisteredCount();
    }
    
    useEffect(()=>{
      getItem();  
    },[]);


    const registerProject = async (e) => {
        e.preventDefault();

        const x = await selectproject( studentInfo.studInfo.mail, id);

        //check
        if(x === 200){
            toast.success('Registered Successfully', {
              position: 'top-center'
            });
            setIsRegistered(1); 
            await increaseStepDone(studentInfo.studInfo.mail);

            //get all interested student in the project
            const y = await getInterestedStudents(id);
        }
        else if(x === 401)
        {
              toast.error('Please choose your partner before registering.', {
                position: 'top-center'
              });
        }
        else if(x === 402)
        {
            toast.error('Project already alloted to a group.', {
              position: 'top-center'
          });
        }
        else if(x === 403)
          {
              toast.error('You have already been alloted a project.', {
                position: 'top-center'
              });
        }
        else if(x === 404)
          {
              toast.error('You partner is already been alloted a project.', {
                position: 'top-center'
              });
        }
        else if(x === 406)
          {
              toast.error('You have not uploaded grade card.', {
                position: 'top-center'
              });
        }
        else if(x === 407)
          {
              toast.error('You partner have not uploaded grade card.', {
                position: 'top-center'
              });
        }
        else if(x === 407)
          {
              await StudentMicrosoftLogin();
        }

        else if(x === 500)
        {
            toast.error('Server error. Kindly contact the admin', {
              position: 'top-center'
            });
        }
        
        setShowModal(false);
      }


    const deRegisterProject = async (e) => {
        e.preventDefault();

        const x = await deselectproject( studentInfo.studInfo.mail, id);

        //check
        if(x === 200){
            toast.success('De-Registered Successfully', {
              position: 'top-center'
            });
            setIsRegistered(1); 
          
        }
        else if(x === 401)
        {
              toast.error('Project is not alloted yet.', {
                position: 'top-center'
            });
        }
        else if(x === 402)
        {
              toast.error('You are not registered. Kindly contact admin', {
                position: 'top-center'
            });
        }
        else if(x === 403)
        {
              toast.error('You cannot de-register after the project is alloted to you.', {
                position: 'top-center'
            });
        }
        else if(x === 500)
        {
            toast.error('Server error. Kindly contact the admin', {
              position: 'top-center'
          });
        }
    }

    const click = () => {
        setShowModal(true);
    }
   

    return(
        <div className='w-full px-2' style={{'fontFamily':'Manrope'}}>
          <div className="p-3 rounded-lg border-2 bg-gray-100">
            <div className="py-1">
                <div className="flex items-center justify-center font-Manrope tracking-tight leading-5 text-lg md:text-xl bg-gray-300 rounded-sm py-2 font-semibold md:font-bold">
                  <i className="fa-solid fa-book text-xl px-2"></i>
                  {project[0].title}
                </div>

                <div className="card-subtitle text-muted py-2 md:py-3">
                  <div className='flex items-center'>
                    <span className="material-symbols-outlined pr-1">
                    person
                    </span>
                    <div className='text-xs md:text-sm'>{project[0].co_supervisor}</div>
                  </div>
                  <h6 className='text-xs md:text-sm'>(co-supervisor)</h6>
                </div>
                <hr/>

                <div className="text-xs md:text-[1rem] leading-normal font-Manrope py-2 md:py-3 md:pl-1">{project[0].brief_abstract}</div>

                <hr/>
                
                <div className="py-2 md:py-3">
                  <div className='flex items-center pb-0 mb-0'>
                    <span className="material-symbols-outlined pr-1">
                    school
                    </span>
                    <div className='font-semibold text-xs md:text-lg '>
                      Specialization
                    </div>
                  </div>
                  <div className='text-xs md:text-sm pl-1'>{project[0].specialization}</div>
                </div>
                  
                {
                  loading
                  ?
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                  :
                  alloted
                  ?
                  <div className='mt-2 text-center text-red text-xl font-medium'>
                      This project has been alloted to a group.
                  </div>
                  :
                  isRegistered === 1
                  ?
                  <button 
                    id="myBtn" 
                    className='disabled py-1 cursor-not-allowed mx-auto flex justify-center items-center no-underline w-32 rounded-md text-white div-1 font-semibold mt-2 hover:bg-red-700 text-sm md:text-lg' 
                    disabled 
                    style={{'backgroundColor':'#EC2D01'}}
                  >
                    De-Register
                  </button>
                  :
                  <button 
                    id="myBtn" 
                    className='mx-auto flex justify-center items-center no-underline w-24 md:w-32 rounded-md text-white div-1 font-semibold text-sm md:text-lg py-1 mt-2 bg-yellow-600 hover:bg-yellow-700' 
                    onClick={click}
                  >
                    Register
                  </button>
                }
                
                

                {/* modal on new project */}
                {showModal
                ?
                <div id="myModal" className="z-10 fixed top-1/4 left-0 md:left-1/3 w-full h-full p-2">
                  <div className="p-6 pt-2 rounded-md bg-gray-200 w-fit border border-gray-300 border-opacity-40 shadow-lg">
                    <span 
                      className="text-3xl flex justify-end"
                    >
                      <div className='cursor-pointer text-gray-600 text-4xl' onClick={() => {setShowModal(false)}}>&times;</div>
                    </span>
                    <div 
                      id='myButton' 
                      className='flex items-center text-lg pt-4 gap-3'
                    >
                        Are you sure you want to Register? 
                        <Link 
                          className='flex justify-center items-center no-underline w-fit px-3 py-1 rounded-md text-white div-1 font-medium bg-yellow-600 hover:bg-yellow-700' 
                          onClick={registerProject}
                        >
                            Register
                        </Link>
                      </div>
                  </div>
                </div>
                :
                ""}
              </div>
              {/* modal */}      
              
          </div>
      </div>
    )}

export default SpecificProjectProjectcard;
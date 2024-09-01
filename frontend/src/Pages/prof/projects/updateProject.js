import { useState,useContext,useEffect } from "react";
import { useNavigate,useParams,Link } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext';
import ProfContext from '../../../context/prof/ProfContext';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AuthContext from "../../../context/auth/AuthContext";
import MainPagesHeader from "../../../components/mainPagesHeaderProf";

const NewProject=()=> {
    const {updateProject, Projectspecific} = useContext(ProjectContext);
    const { ProfMicrosoftLogin } = useContext(AuthContext);
    const { getProfDetailsFromMicrosoft, checkProfEligible } = useContext(ProfContext);

    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [random, setRandom] = useState(false);
    const [itemData, setItemData] = useState({
        title: '',
        abstract: '',
        cosupervisor: '',
        specialization: ''
    });


    const items = useSelector(state => state.allProjects.specificProjects);
    const profInfo = useSelector(state => state.prof.profInfo);


    //check prof allowed or not to access the page
  const checkAllowed = async () => {
    const x = await getProfDetailsFromMicrosoft();
    
    if(x === 200)
    {
        if(profInfo && profInfo.profInfo)
        {
            var job = "student";
            var roll = "340103016";

            job = profInfo.profInfo.jobTitle;
            roll = profInfo.profInfo.surname ? profInfo.profInfo.surname : "340103016";


            if(checkProfEligible(job, roll))
            {
                setAllowed(true);
                setLoading(false);
            } 
            else // not allowed
            {
                setAllowed(false);
                setLoading(false);
            }
        }
        else if(random) // not allowed
        {
            setAllowed(false);
            setLoading(false);
        }
        setRandom(true);
    } 
    else //not logged in or token expired
    {
        //if user if not logged in, redirect user to login page
        await ProfMicrosoftLogin();
    }
  };

    const getItem=async ()=>{
        checkAllowed();
        await Projectspecific();

       
      }
      useEffect(()=>{
        getItem();

        getProject();
      },[random]);

      const params = useParams();
      const id = params.id;

      const getProject = () => {

        const project = items.length && items.filter(project => project._id === id);

        if (project && project.length > 0) {
            const selectedProject = project[0]; // Assuming you only need the first matching project
            setItemData({
                title: selectedProject.title,
                abstract: selectedProject.brief_abstract,
                cosupervisor: selectedProject.co_supervisor,
                specialization: selectedProject.specialization
            });
        }
      }

      
      const onChangeHandler = (e) => {
        setItemData({...itemData,[e.target.name]:e.target.value});
      }

      const navigate = useNavigate()
        const submit = async (e)=>{
            e.preventDefault();
            
            if (profInfo && profInfo.profInfo)
            {
                await updateProject(itemData.title,itemData.abstract,itemData.cosupervisor,itemData.specialization,id,profInfo.profInfo.mail);
                    toast.success('Updated successfully', {
                    position: 'top-center'
                });
                navigate('/btp/prof/owner/projects')
            }
        }
  
        return (
          <div class="w-full">
            <MainPagesHeader/>
            <div className="flex p-4">
              <Link className='goback' to={`/btp/prof/owner/projects`}><i class="fa-sharp fa-solid fa-arrow-left fa-lg"/></Link>
              <div class="text-2xl flex justify-start items-center font-bold mx-auto gap-2 pr-8">
                <span class="material-symbols-outlined text-3xl">
                    edit_note
                </span>
                <div className="border-b-2 border-gray-300 px-2">Update Project</div>
              </div>

            </div>
              <form 
                class="w-4/5 md:3/4 mx-auto shadow-xl rounded-lg px-8 p-4 pb-3 mb-2 mt-4 bg-gray-100 border-4" 
                onSubmit={submit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div class="mb-2 mr-0 md:mr-24">
                  <label class="block text-gray-700 font-bold mb-1 md:mb-2" for="username">
                    Project Title:
                  </label>
                  <input
                    class="appearance-none border-2 text-sm md:text-md rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    id="username"
                    type="text"
                    placeholder="Enter project title"
                    name="title"
                    autoFocus
                    onChange={onChangeHandler}
                    value={itemData.title}
                  />
                </div>
                <div className="mb-2 ">
                  <label class="block text-gray-700 font-bold mb-1 md:mb-2" for="email">
                  Brief Abstract:
                  </label>
                  <textarea id="message"
                            rows="5" 
                            class="block w-full text-sm md:text-md text-gray-700 bg-gray-50 rounded-lg border-2 px-3 py-2 focus:outline-none" 
                            placeholder="Write project details..."
                            name="abstract"
                            onChange={onChangeHandler}
                            value={itemData.abstract}
                    ></textarea>
                </div>
                <div className="mb-2 mr-0 md:mr-24">
                  <label class="block text-gray-700 font-bold mb-1 md:mb-2" for="confirm-password">
                    Co-Supervisor:
                  </label>
                  <input
                    class="appearance-none border-2 rounded text-sm md:text-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    id="cosupervisor"
                    type="text"
                    placeholder="Name of Co-Supervisor"
                    name="cosupervisor"
                    onChange={onChangeHandler}
                    value={itemData.cosupervisor}
                  />
                </div>
                <div className="mb-2">
                  <label class="block text-gray-700 font-bold mb-1" for="password">
                  Specialization:
                  </label>
                  <input
                    class="appearance-none border-2 text-sm md:text-md rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Enter the specialization"
                    name="specialization"
                    onChange={onChangeHandler}
                    value={itemData.specialization}
                  />
                </div>
                </div>
                
                <div class="mt-8 flex justify-center mx-auto">
                  <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold text-lg py-1 px-5 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Submit
                  </button>

                </div>
              </form>
        </div>
        );
}

export default NewProject
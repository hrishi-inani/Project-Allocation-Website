import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext';
import ProfContext from '../../../context/prof/ProfContext';
import ProjectCard from './allProjectCard';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AuthContext from '../../../context/auth/AuthContext';

const OwnerProjectsComponent = () => {

  //get items from redux
  const items = useSelector((state) => state.allProjects.allProjects);

  const { allProjectsProf} = useContext( ProjectContext );
  const { getProfDetailsFromMicrosoft } = useContext(ProfContext);
  const { ProfMicrosoftLogin } = useContext(AuthContext);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(items.length > 0 ? true : false);
  

  const getItem = async () => {

    await getProfDetailsFromMicrosoft();

    const x = await allProjectsProf();

    if(x === 408)
    {
        await ProfMicrosoftLogin();
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
  };

  useEffect(() => {
    getItem();
    document.body.classList.add("disable-scrolling");
  }, []);

  const [search, setSearch] = useState("");

  const detectChanges = async (e) => {
    setSearch(e.target.value);
  };
 
  
  return (
        <div class="w-full overflow-x-hidden">
          {allowed
          ?
          <div class="w-full text-left">
            <nav class="shadow-md">
              <div class="mx-auto p-2">
                <div class="flex items-center justify-between h-16">
                  <div class="flex items-center justify-start">
                    <div className="flex items-center justify-start gap-2 px-2">
                        <i className="fas fa-search text-xl pr-2 h-full" />
                        <div className="form-outline">
                            <input
                                id="search-input"
                                type="search"
                                className="outline-none border rounded-md p-2"
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
                  </div>
                  <div class="absolute inset-y-0 right-0 hidden md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Link
                      to={`/btp/prof/owner/projects`}
                      class=" px-3 py-2 rounded-md text-xl "
                      style={{ textDecoration: 'none' }}
                    >
                      <i
                        class="fa-solid fa-user text-md"
                        style={{ backgroundColor: 'transparent', paddingRight: '0.5rem' }}
                      ></i>
                      My Projects
                    </Link>
                    <div
                      class="text-gray-800 px-3 py-2 no-underline rounded-md text-xl font-x-large font-bold"
                    >
                      All Projects
                    </div>
                  </div>
                  {mobileMenu 
                  ?
                  (
                    <div className="flex md:hidden" onClick={() => setMobileMenu(false)}>
                      <div class="material-symbols-outlined text-black text-xl ml-12 mr-2">cancel</div>
                    </div>
                  ) : (
                    <div className="flex md:hidden" onClick={() => setMobileMenu(true)}>
                      <div class="material-symbols-outlined text-black text-xl ml-12 mr-2">menu_open</div>
                    </div>
                  )}
                  {mobileMenu && (
                    <div className="flex flex-col md:hidden mt-12 z-10 border bg-white px-4 top-4 rounded-sm fixed left-8 cursor-pointer ">
                      <Link
                        to={`/btp/prof/owner/projects`} className="text-gray-700 no-underline py-2 text-lg border-b">
                          My Projects
                        </Link>
                      
                        <div className="text-gray-600 hover:text-gray-700 text-lg py-2 border-b no-underline font-bold ">
                          All projects
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>


            {loading ? (
              <div class="flex items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div>
                
                <div className="grid grid-cols-2 gap-2 md:gap-4 pt-4 pb-2 px-2 md:px-6 md:grid-cols-3 lg:grid-cols-5">
                  {items
                    .filter(projects => {
                      return search.toString().toLowerCase() === ''
                        ? projects
                        : projects.title.toLowerCase().includes(search.toLocaleLowerCase());
                    })
                    .map((project, i) => {
                      return <ProjectCard key={i} project={project} />;
                    })}
                </div>

                <div
                  class="_feedback_container_1ob32_125 pl-4 md:pl-24 lg:pl-48"
                  style={{
                    height: '15vh',
                    width: '100vw',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'whitesmoke',
                  }}
                >
                  <svg
                    style={{ height: '30px', paddingRight: '10px' }}
                    class="MuiSvgIcon-root _add__comment_1ob32_146"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4zm-2 13.17L18.83 16H4V4h16v13.17zM13 5h-2v4H7v2h4v4h2v-4h4V9h-4z"
                    ></path>
                  </svg>
                  <p
                    class="_para__feedback_1ob32_130 text-xs md:text-sm lg:text-lg flex-wrap"
                    style={{
                      marginBottom: '0.5vw',
                      display: 'flex',
                      alignContent: 'center',
                    }}
                    hover={{ textDecoration: 'underline' }}
                  >
                    We value your opinion, please take a moment to fill out our{' '}
                    <Link
                      className="px-1 "
                      to={`/proffeedback`}
                      style={{ textDecoration: 'none' }}
                    >
                      feedback form
                    </Link>{' '}
                    to help us improve.
                  </p>
                </div>
              </div>
            )}
          </div>  
           :
           <div className="w-full flex justify-center mt-8 md:mt-20">
               <div className="max-w-md bg-white rounded-lg shadow-md p-8">
                   <h1 className="text-3xl font-bold mb-4">404</h1>
                   <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for could not be accessed by you.</p>
                   <div className="bg-blue-500 text-center text-white text-xl font-bold py-2 px-4 rounded">
                   You are not a professor at IITG.
                   </div>
               </div>
           </div>
           }  
        </div>
    )
}
export default OwnerProjectsComponent;
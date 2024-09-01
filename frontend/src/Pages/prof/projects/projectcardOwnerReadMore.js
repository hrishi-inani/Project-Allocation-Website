import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectContext from '../../../context/project/ProjectContext';
import AuthContext from '../../../context/auth/AuthContext';

function Projectcard(props) {
    const { project } = props;
    const { deleteProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const { ownerdetails } = useContext(AuthContext);

    const params = useParams();
    const id = params.id;

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getItem = async () => {
            await ownerdetails(id);
        }
        getItem();
    }, [id, ownerdetails]);

    const clickHandler = async (e) => {
        e.preventDefault();
        const x = await deleteProject(id);
        if (x === 200) {
            navigate('/btp/prof/owner/projects');
            toast.success('Deleted successfully', {
                position: 'top-center'
            });
        } else if (x === 403) {
            navigate('');
            toast.error('You cannot delete projects of others', {
                position: 'top-center'
            });
        }
    }

    return (
        <div className='w-full py-2 font-Manrope'>
            <div className="p-3 rounded-lg border-4 bg-gray-100" style={{ "width": "auto", "height": "auto" }}>
                <div className="flex-col gap-2">
                    <div className="flex items-center justify-center font-Manrope tracking-tight leading-5 text-lg md:text-xl bg-gray-300 rounded-sm py-2 font-semibold md:font-bold">
                      <i className="fa-solid fa-book text-xl px-2"></i>
                      {project.title}
                    </div>
                    <div className="card-subtitle text-muted py-2 md:py-3">
                      <div className='flex items-center'>
                        <span className="material-symbols-outlined pr-1">
                        person
                        </span>
                        <div className='text-xs md:text-sm'>{project.co_supervisor}</div>
                      </div>
                      <h6 className='text-xs md:text-sm'>(co-supervisor)</h6>
                    </div>
                    <hr/>

                    <div className="text-xs md:text-[1rem] leading-normal font-Manrope py-2 md:py-3 md:pl-1">{project.brief_abstract}</div>

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
                      <div className='text-xs md:text-sm pl-1'>{project.specialization}</div>
                    </div>
                    <h6 className="card-title text-sm py-1">Created on {project.creation_date} </h6>
                    <h6 className="card-title pb-0 text-sm py-1">Created at {project.creation_time} </h6>
                    <button className='mx-auto w-1/4 outline-none border-none flex justify-center items-center mt-2 px-2 py-1 rounded-md bg-red-600 text-white' onClick={() => {setShowModal(true)}}>Delete</button>
                    </div>
                </div>


                {/* modal on new project */}
              {showModal
              ?
              <div id="myModal" className="z-10 fixed top-1/4 left-0 md:left-1/3 w-full px-2 h-full">
                  <div className="p-6 pt-2 rounded-md bg-gray-200 w-fit border border-gray-300 border-opacity-40 shadow-lg">
                    <span 
                      className="text-3xl flex justify-end"
                    >
                      <div className='cursor-pointer text-gray-600 text-4xl' onClick={() => {setShowModal(false)}}>&times;</div>
                    </span>
                    <div 
                        className='flex items-center text-lg pt-4 gap-3'
                      >
                      Are you sure you want to delete? 
                      <Link 
                        className='flex justify-center items-center no-underline w-fit px-3 py-1 rounded-md text-white div-1 font-medium bg-red-600 hover:bg-red-700' 
                        onClick={clickHandler}
                      >
                          Delete
                      </Link>
                    </div>
                  </div>
              </div>
              :
              ""}
        </div>
    );
}

export default Projectcard;

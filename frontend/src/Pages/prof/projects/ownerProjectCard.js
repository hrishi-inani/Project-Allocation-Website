import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineUpdate } from "react-icons/md";

const Projectcard = (props) => {
    const { project } = props;
   
    return(
        <div className='mx-auto w-full text-gray-600' style={{fontFamily: "Manrope"}}>
            <div className="border-2 rounded-lg bg-gray-100">
                <div className="text-center w-full ">
                    <div className="px-2 py-3 break-words text-sm font-semibold md:text-[1rem] tracking-normal leading-4 md:leading-5 capitalize">
                        {project.title.slice(0,40)} {project.title.length > 40 ? <div>...</div> : ""}
                    </div>
                    <hr/>
                    <h5 className="text-xs md:text-sm text-muted text-center py-2 capitalize">
                        {project.co_supervisor}
                        <div className='text-xs md:text-sm text-center'>
                            (co-supervisor)
                        </div>
                    </h5>
                    
                    <p className="pb-0 md:pb-4 text-xs md:text-sm px-2 pt-2 text-center capitalize">
                        {project.brief_abstract.slice(0,120)}
                        <Link 
                            to={project._id} 
                            className='no-underline px-1 font-medium text-blue-600 lowercase'
                        >
                            ...read more
                        </Link>
                    </p>
                    <p className="text-xs md:text-sm pb-2 flex-col items-center">
                        <h6 className='m-0 text-xs md:text-sm font-medium'>
                            Specialization
                        </h6>
                        <div className='text-xs md:text-sm pb-0 capitalize'>
                            {project.specialization}
                        </div>
                    </p>
                    <h6 className="text-xs md:text-sm pt-1 text-center">
                        {project.creation_date} 
                    </h6>
                    <h6 className="text-xs md:text-sm pb-2 text-center">
                        {project.creation_time} 
                    </h6> 

                    <div className='pt-2 pb-4 pr-6 flex justify-end items-center'>
                        <Link className="material-symbols-outlined hover:text-blue-600" to={`/btp/prof/owner/update/${project._id}`}>
                            <MdOutlineUpdate />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )}

export default Projectcard;
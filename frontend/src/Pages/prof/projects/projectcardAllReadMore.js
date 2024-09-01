import React,{useContext,useEffect,useState} from 'react';
import { Link,useParams } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const projectcardAllReadMore = ( props ) =>{
    const { project } = props;
    return(
        <div className='w-full px-2' style={{'fontFamily':'Manrope'}}>
          <div className="p-3 rounded-lg border-2 bg-gray-100">
            <div className="py-1">
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
              
          </div>
      </div>
      </div>
    )}

export default projectcardAllReadMore;
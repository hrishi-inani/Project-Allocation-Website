import React, { useContext, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext.js';
import ProjectCardSpecific from "./projectcardAllReadMore.js";
import ProfDetails from '../../student/projects/profDetails'

import { useSelector } from 'react-redux';

const SpecificProjectCard = () => {
  const { allProjectsProf, details, getOwnerDetails } = useContext(ProjectContext);
  const items = useSelector(state => state.allProjects.allProjects);

  const params=useParams();
  const id = params.id;

  const Store = [];  
  Store.push(details);

  const getItem = async () => {
    await allProjectsProf();

    await getOwnerDetails(id);
  }

  useEffect(() => {
    getItem();
  }, []);


  return (
    <div className='readmorepage2'>
      <div className="flex pt-3 pl-3">
        <Link to={`/btp/prof/all/projects`}><i class="fa-sharp fa-solid fa-arrow-left fa-lg text-2xl md:text-3xl"></i></Link>
      </div>
      <div className='px-[5%] md:px-[10%]'>
        <div className="flex my-3 w-full mx-auto">
          <div className="mx-auto">
            {Store.map((detail,i) => {return (<ProfDetails key={i} detail={detail} />)})}
          </div>
        </div>
        {items && items.length > 0 && items.filter((project) => project._id === id).map((projects, i) => {
          return (<ProjectCardSpecific key={i} project={projects} />)
        })}
      </div>
    </div>
  );
};

export default SpecificProjectCard;
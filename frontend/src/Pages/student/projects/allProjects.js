import React from 'react';
import StudentProjects from './allProjectsComponent.js';
import Header from '../../../components/mainPagesHeader';

const StudentAllProjects = () => {
    return(
        <div>
            <Header/>
            <StudentProjects className='disable-scrolling'/>   
        </div>
    )
}

export default StudentAllProjects;
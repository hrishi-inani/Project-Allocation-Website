import React from 'react';
import StudentProjects from './specificProjectComponent.js';
import Header from '../../../components/mainPagesHeader.js';

const StudentSpecificProject = () => {
    return(
        <div>
            <Header/>
            <StudentProjects className='disable-scrolling'/>   
        </div>
    )
}

export default StudentSpecificProject;
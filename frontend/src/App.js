import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//context
import AuthState from './context/auth/AuthState.js';
import ItemState from './context/project/ProjectState.js';
import StudentState from './context/student/StudentState.js';
import ProfState from './context/prof/ProfState.js';

//import pages
import Interface from './Pages/interface.js';
import Proflogin from './Pages/prof/auth/profAuth.js';
import Studentlogin from './Pages/student/auth/studentAuth.js';
import StudentHome from './Pages/student/projects/allProjects.js';
import StudentUpload from './Pages/student/others/upload.js';
import PartnerHome from './Pages/student/others/partner.js';
import StudentSpecificProject from './Pages/student/projects/specificProject.js';
import ProfallProjectPage from './Pages/prof/projects/allProjectPage.js';
import OwnerProjectPage from './Pages/prof/projects/ownerProjectPage.js';
import ProfReadMore from './Pages/prof/projects/ownerReadMorePage.js';
import AllReadMore from './Pages/prof/projects/allReadMorePage.js';
import StudentFeedback from './Pages/student/others/feedback.js'
import ProfFeedback from './Pages/prof/others/feedback.js'
import ProjectUpdate from "./Pages/prof/projects/updateProject.js"
import FinalStudentUpload from "./Pages/student/others/final.js"
import DownloadAll from "./Pages/download.js"

const App = () => {
  return (
    <AuthState>
      <ItemState>
        <StudentState>
          <ProfState>
            <BrowserRouter>
              <Routes>
                {/* starting interface page */}
                <Route path='/' element={<Interface />} />

                {/* prof login page */}
                <Route path='/btp/prof' element={<Proflogin />} />

                {/* prof home page */}
                <Route path='/btp/prof/owner/projects' element={<OwnerProjectPage />} />

                {/* All project page */}
                <Route path='/btp/prof/all/projects' element={<ProfallProjectPage />} />

                {/* prof particular project page */}
                <Route path='/btp/prof/owner/projects/:id' element={<ProfReadMore />} />

                {/* Allprojects particular project page */}
                <Route path='/btp/prof/all/projects/:id' element={<AllReadMore />} />

                {/* prof feedback page */}
                <Route path='/btp/prof/feedback' element={<ProfFeedback />} />

                {/* project update page */}
                <Route path='/btp/prof/owner/update/:id' element={<ProjectUpdate />} />


                <Route path='/btp/prof/download/mesa/head' element={<DownloadAll />} />


                {/* student login page */}
                <Route path='/btp/student' element={<Studentlogin />} />

                {/* student documents page */}
                <Route path='/btp/student/upload' element={<StudentUpload />} />

                {/* {student home page} */}
                <Route path='/btp/student/projects' element={<StudentHome />} />

                {/* student particular project page */}
                <Route path='/btp/student/projects/:id' element={<StudentSpecificProject />} />

                {/* student partner find page */}
                <Route path='/btp/student/partner' element={<PartnerHome />} />

                {/* student feedback page */}
                <Route path='/btp/student/feedback' element={<StudentFeedback />} />


                <Route path='/btp/student/document/upload' element={<FinalStudentUpload />} />
              </Routes>
            </BrowserRouter>
          </ProfState>
        </StudentState>
      </ItemState>

    </AuthState>
  );
}

export default App;
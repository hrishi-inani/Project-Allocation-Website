import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/interfacePageHeader';
import Studentlogin from './loginComponent';


const StudentAuth = () => {
    return(
        <div className='h-[100vh] w-full bg-gray-200 overflow-y-hidden'>
            <div className='w-full h-[12vh] md:h-[15vh]'>
                <Header />
            </div>
            <div className='w-full h-[80vh]'>
                <Link to={`/`}>
                    <i className="fa-sharp fa-solid fa-arrow-left text-blue-700 mx-2 md:mx-4 text-2xl md:text-3xl p-2"/>
                </Link>
                <Studentlogin />
            </div>
        </div>
   
    )
}
export default StudentAuth;
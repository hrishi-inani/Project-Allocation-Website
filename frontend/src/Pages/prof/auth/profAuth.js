import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../components/interfacePageHeader';
import Proflogin from './loginComponent.js';

const ProfAuth = () => {
    return (
        <div className='h-[100vh] w-full bg-gray-200 overflow-y-hidden'>
            <div className='w-full h-[12vh] md:h-[15vh]'>
                <Header />
            </div>
            <div className='w-full h-[80vh]'>
                <Link to={`/`}>
                    <i className="fa-sharp fa-solid fa-arrow-left text-blue-700 mx-2 md:mx-4 text-2xl md:text-3xl p-2"/>
                </Link>
                <Proflogin />
            </div>
        </div>
    );
};

export default ProfAuth;

import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfContext from '../context/prof/ProfContext';

const MainPagesHeader = () => {
    const { LogOut } = useContext(ProfContext);
    const Navigate = useNavigate();

    const logoutFunc = async () => {
        await LogOut();
        Navigate('/');
    };
        
    return(
        <div className='w-full bg-gray-800 text-white flex justify-between items-center py-1 md:px-6'>
            <div className="flex items-center">
              <img 
                className="h-10 md:h-16 w-10 md:w-16" 
                src="https://iitg.ac.in/mech/static/images/logo.png" 
                alt='iitg logo'
            />
                <span className='md:flex'>
                    <div className='text-xs md:text-2xl md:ml-6 font-medium md:font-semibold'>
                        Indian Institute of Technology,
                    </div>
                    <div className='text-xs md:text-2xl md:ml-2 font-medium md:font-semibold'>
                        Guwahati
                    </div>
                </span> 
            </div> 
            
            <span className='flex items-center gap-1'>
                <i className='fa-solid fa-right-from-bracket font-bold text-xs md:text-xl md:mx-1'></i> 
                <div 
                    className='cursor-pointer no-underline hover:bg-red-700 text-white bg-red-600 p-1 rounded-md text-center text-xs md:text-lg font-medium md:font-semibold' 
                    onClick={logoutFunc} 
                >
                    LogOut
                </div>
            </span>
        </div>
)
};
export default MainPagesHeader;
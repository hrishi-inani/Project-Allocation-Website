import React from 'react';
import { Link } from 'react-router-dom';

const InterfacePageHeader = () => {
    return(
        <div    
            className='w-full text-white flex justify-between items-center py-3 md:px-6' 
            style={{'backgroundColor':'#10A19D'}}
        >
            <div className="navbar-brand float-left flex items-center mx-4">
                <img 
                    className="h-12 md:h-20 w-12 md:w-20" 
                    src="https://iitg.ac.in/mech/static/images/logo.png" 
                    alt='iitg logo'
                />
            <span className='flex flex-col md:mx-8'>
                <div className='hidden md:block text-white text-xs md:text-3xl font-medium md:font-bold'>
                    Department of Mechanical Engineering
                </div>
                <div className='hidden md:block text-xs md:text-2xl font-medium md:font-semibold'>
                    Indian Institute of Technology, Guwahati
                </div>
            </span> 
            </div> 
            
            
            <span className='flex'>
                <Link 
                    to='https://iitg.ac.in/mech/academics/undergraduate/latest/sem-5/btp-phase-i/' 
                    className='text-white no-underline text-xs md:text-xl mx-3 font-medium'
                >
                        BTP Phase 1
                </Link>
                 <Link 
                    to='https://iitg.ac.in/mech/academics/undergraduate/latest/sem-5/' 
                    className='text-white no-underline text-xs md:text-xl mx-3 font-medium'
                >
                    Sem 5
                </Link>
            </span>
        </div>
    )
}

export default InterfacePageHeader;
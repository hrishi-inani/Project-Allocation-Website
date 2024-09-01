import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/interfacePageHeader';

const Body = () => {
    return(
        <div className='h-screen'>
            <div className='h-[20%]'>
                <Header />
            </div>
            <div className='flex flex-wrap justify-center items-center h-auto md:h-[70vh]'>
                <div className="w-60 h-60 md:w-[14.375rem] md:h-[14.375rem] rounded-full flex justify-center items-center m-10 shadow-md bg-no-repeat bg-contain bg-center" 
                    style={{backgroundImage: "url('https://www.isponline.org/wp-content/uploads/sites/71/2020/05/TeachersTrained-1024x1024.png')"}}>
                    <Link 
                        to='/btp/prof' 
                        className="box-border no-underline rounded px-2 py-1 bg-[#FB2576] text-black font-serif text-lg md:text-[1.5rem] font-semibold"
                    >
                        Professor
                    </Link>
                </div>
                <div className="w-60 h-60 md:w-[14.375rem] md:h-[14.375rem] rounded-full flex justify-center items-center m-10 shadow-md bg-no-repeat bg-contain bg-center" 
                    style={{backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3334/3334309.png')"}}>
                    <Link 
                        to='/btp/student' 
                        className="box-border no-underline rounded px-2 py-1 bg-[#FB2576] text-black font-serif text-lg md:text-[1.5rem] font-semibold"
                    >
                        Student
                    </Link>
                </div>
            </div> 
        </div>
    )
}

export default Body;
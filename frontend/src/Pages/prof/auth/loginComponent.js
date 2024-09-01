import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';

const Body2 = () => {
    const { ProfMicrosoftLogin } = useContext(AuthContext);

    const clickHandler = async () => {
        await ProfMicrosoftLogin();
    };


    return (
        <div className="w-full flex flex-col md:flex-row h-full">
            <div className="px-6 md:px-40 w-full">
                <div className='pb-4 text-gray-900'  style={{"fontFamily":"Manrope"}}>
                        <p className="text-xl md:text-2xl font-normal uppercase pt-2 text-gray-800">BTP Phase I - <b>Professor login</b></p>
                        <p className="text-sm md:text-lg text-gray-800 leading-5">NOTE - Kindly refrain from login if you are not a professor.</p>
                        <div
                            class = "w-4/5 md:w-1/3 h-12 px-2 md:px-0 mt-10 text-white hover:opacity-80 flex justify-center items-center rounded-md cursor-pointer font-medium"
                            style={{"background-color": "#3b5998"}}
                            onClick={clickHandler}>
                            <i class="fa-brands fa-windows text-2xl my-auto mx-2 md:mx-3"></i>
                            Prof Sign-In with Microsoft
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}

export default Body2;

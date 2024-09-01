import React from 'react';

const ProfDetails = (props) => {
    const { detail } = props;
   
    return(
    <div className='w-full mx-auto bg-gray-100' style={{'fontFamily':'Manrope'}}>
        <div className="py-1 flex items-start ml-0 mr-4 rounded ">
            <div className="flex flex-col items-start md:flex-row px-4 py-1">
                <div className="font-Manrope md:font-bold text-sm md:text-xl items-center my-auto md:pr-6">Project Supervisor :-</div>
                <div className="text-muted font-medium text-sm md:text-xl flex items-center justify-center my-auto pr-4 pt-1 md:pt-0 capitalize">
                    <i className="fa-solid fa-user text-md pr-2"></i>
                    {detail.name}
                </div>
                <div className="text-muted font-medium text-sm md:text-xl flex items-center justify-center my-auto pt-1 md:pt-0">
                    <i className="fa-solid fa-envelope pr-2 pt-1"></i>
                    {detail.email}
                </div>
            </div>
        </div>
    </div>
)};
export default ProfDetails;
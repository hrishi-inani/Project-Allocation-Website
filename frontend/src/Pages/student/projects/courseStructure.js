import React from 'react'

const courseStructure = () => {
  return (
        <div
            id='course'
            className="flex justify-center"
        >
            <div className="w-2/3 md:w-1/3 border rounded-md mb-4">
                <div>
                    <img
                    src="https://iitg.ac.in/mech/static/images/placeholdercourse.jpg"
                    width="100%"
                    height="50"
                    alt=""
                    className=""
                    style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="container text-dark font-semibold">
                    <h4 className='text-center py-2'>About this course: </h4>
                    <hr />
                    <div className="text-center py-2">
                        <ul className='font-medium text-sm'>
                            <li>Course Name: BTP Phase I</li>
                            <li>Course Code: ME 398</li>
                            <li>L-T-P-C : 0-0-3-3</li>
                            <li>Syllabus: NaN </li>
                            <li>Course Type: Core course</li>
                        </ul>
                    </div>
                </div>
            </div>
            <br />
        </div>
  )
}

export default courseStructure
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/mainPagesHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StudentContext from '../../../context/student/StudentContext';
import AuthContext from '../../../context/auth/AuthContext';

const AddPartnerPage = () => {
    const { addPartner, partnerRequest, sentRequest, finalPartner } = useContext(StudentContext);
    const { getUserDetailsFromMicrosoft, StudentMicrosoftLogin } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [random, setRandom] = useState(false);

    const pendingRequests = useSelector((state) => state.student.sentRequests);
    const studentInfo = useSelector((state) => state.student.studentInfo);
    const upcomingRequests = useSelector((state) => state.student.partnerRequests);

    const handleAddPartner = async (e) => {
        e.preventDefault();
        if (studentInfo && studentInfo.studInfo) {
            if (studentInfo.studInfo.mail === email) {
                toast.error('You have entered your own email.', {
                    position: 'top-center'
                });
                return;
            }
            const x = await addPartner(studentInfo.studInfo.mail, email);
            if (x === 200) {
                toast.success('Sent successfully', {
                    position: 'top-center'
                });
                navigate('/btp/student/projects');
            }
            else if (x === 401) {
                toast.error('Student not logged in', {
                    position: 'top-center'
                });
            }
            else if (x === 402) {
                toast.error("Partner id don't exist", {
                    position: 'top-center'
                });
            }
            else if (x === 403) {
                toast.error("You already have partner.", {
                    position: 'top-center'
                });
            }
            else if (x === 404) {
                toast.error("Partner already have partner.", {
                    position: 'top-center'
                });
            }
            else {
                toast.error('Server error. Contact admin.', {
                    position: 'top-center'
                });
            }
        }
    };


      const handleAcceptRequest = async (request) => {
        if (studentInfo && studentInfo.studInfo) {
            const x = await finalPartner(studentInfo.studInfo.mail, request);
            if (x === 200) {
                toast.success('Partner Alloted', {
                    position: 'top-center'
                });
                navigate('/btp/student/projects');
            }
            else if (x === 403) {
                toast.error("You already have partner.", {
                    position: 'top-center'
                });
            }
            else if (x === 404) {
                toast.error("Partner already have partner.", {
                    position: 'top-center'
                });
            }
            else {
                toast.error('Server error. Contact admin.', {
                    position: 'top-center'
                });
            }
        }
      };

    const getItem = async () => {
        await getUserDetailsFromMicrosoft();
        if (studentInfo && studentInfo.studInfo) {
            await partnerRequest(studentInfo.studInfo.mail);
            await sentRequest(studentInfo.studInfo.mail);
        }
        setRandom(true);
    };

    useEffect(() => {

        getItem();
    }, [random]); 

    const handleBack = () => {
        navigate('/btp/student/projects');
    }


    return (
        <div>

            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-10">
                <div className="mb-5">
                    <h3 className="text-xl sm:text-2xl font-normal text-blue-600 border rounded-lg w-fit p-2 mb-6 hover:text-white hover:bg-blue-400 cursor-pointer" onClick={handleBack}>Return Home</h3>
                    <h2 className="text-xl sm:text-2xl font-semibold">Add Project Partner</h2>
                    <form
                        className="mt-4 flex flex-col sm:flex-row"
                        onSubmit={handleAddPartner}>
                        <input
                            type='email'
                            autoFocus
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Partner's email"
                            className="form-input px-4 py-2 border rounded-md w-full sm:flex-1 outline-none"
                        />
                        <button
                            className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto"
                            type='Submit'
                        >
                            Send
                        </button>
                    </form>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold">Received Requests</h3>
                        <ul className="list-disc pl-5 mt-4">
                            {upcomingRequests.map((request, i) => (
                                <li key={i} className="mt-2 flex justify-between items-center">
                                    <span className="mr-2">{request}</span>
                                    <button
                                        onClick={() => handleAcceptRequest(request)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md"
                                    >
                                        Accept
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold">Sent Requests</h3>
                        <ul className="list-disc pl-5 mt-4">
                            {pendingRequests.map((request, i) => (
                                <li key={i} className="mt-2 flex justify-between items-center">
                                    <span className="mr-2">{request}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AddPartnerPage;

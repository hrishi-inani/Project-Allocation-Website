import React, { useContext, useEffect, useState } from 'react';
import Header from '../../../components/mainPagesHeader';
import fire from '../../../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkmark } from 'react-checkmark'
import StudentContext from '../../../context/student/StudentContext';
import AuthContext from '../../../context/auth/AuthContext';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UploadComponent = () => {

    const { uploadGradeCardMongo, uploadResumeMongo, checkDocumentUploaded, increaseStepDone } = useContext(StudentContext);
    const { getUserDetailsFromMicrosoft, StudentMicrosoftLogin } = useContext(AuthContext);

    const [uploadGrade, setUploadGrade] = useState("");
    const [uploadResume, setUploadResume] = useState("");
    const [checkGrade, setCheckGrade] = useState(false);
    const [checkResume, setCheckResume] = useState(false);
    const [allowed, setAllowed] = useState(true);
    const [random, setRandom] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const navigate = useNavigate();

    const studentInfo = useSelector((state) => state.student.studentInfo);

    const checkerFunc = async () => {
        if(studentInfo && studentInfo.studInfo)
        {
            const x = await checkDocumentUploaded(studentInfo.studInfo.mail);
            if(x === 200)
            {
                setCheckGrade(true);
                setCheckResume(true);

                setLoading1(false);
                setLoading2(false);

                navigate('/btp/student/projects')
            }
            else if(x === 211)
            {
                navigate('/btp/student/document/upload')
            }
            else if(x === 201)
            {
                setCheckGrade(true);
                setCheckResume(false);
            }
            else if(x === 202)
            {
                setCheckGrade(false);
                setCheckResume(true);
            }
            else if ( x === 408)
            {
                setAllowed(false);
            }
            else if ( x === 409 || x === 410)
            {
                await StudentMicrosoftLogin();
            }
        }
    }


    const getItem = async () => {
        await getUserDetailsFromMicrosoft();

        checkerFunc();

        setRandom(true);
    }
    useEffect(() => {
        getItem();
    },[random])

    const handleGrade = (e) => {
        e.preventDefault();

        setLoading1(true);
        if(uploadGrade === "")
        {
            toast.error("No grade card Selected", {
                position: 'top-center'
            });
            return;
        }
        
        const uploadFileRef = fire.storage().ref(`uploads/mesa/${ uploadGrade.name}`);
        
        uploadFileRef.put(uploadGrade).on("state_changed", (snapshot) => {
            const progress = Math.round(
            (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
            );
        },
        (error)=>{
            console.log(error)
        },
            async () => {
                const fileData = await uploadFileRef.getDownloadURL();

                if(!studentInfo || !studentInfo.studInfo)
                {
                    await StudentMicrosoftLogin();
                    return;
                }
                
                const email = studentInfo.studInfo.mail;

                setCheckGrade(true);

                const x = await uploadGradeCardMongo(email, fileData);
                if(x === 200)
                {
                    setUploadGrade("");
                    toast.success("Grade Card Uploaded Successfully", {
                        position: 'top-center'
                    });
                }
                else
                {
                    setUploadGrade("");
                    toast.error("Couldn't upload at the moment.", {
                        position: 'top-center'
                    });
                }
                setLoading1(false);
                });
    }

    const handlerResume = (e) => {
        e.preventDefault();

        setLoading2(true);

        if(uploadResume === "")
        {
            toast.error("No Resume Selected", {
                position: 'top-center'
            });
            return;
        }
        
        const uploadFileRef = fire.storage().ref(`uploads/mesa/${ uploadResume.name}`);
        
        uploadFileRef.put(uploadResume).on("state_changed", (snapshot) => {
            const progress = Math.round(
            (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
            );
        },
        (error)=>{
            console.log(error)
        },
            async () => {
                const fileData = await uploadFileRef.getDownloadURL();

                if(!studentInfo || !studentInfo.studInfo)
                {
                    await StudentMicrosoftLogin();
                    return;
                }
                const email = studentInfo.studInfo.mail;

                setCheckResume(true);

                const x = await uploadResumeMongo(email, fileData);
                await increaseStepDone(email);

                if(x === 200)
                {
                    setUploadResume("");
                    toast.success("Resume Uploaded Successfully", {
                        position: 'top-center'
                    });
                }
                else
                {
                    setUploadResume("");
                    toast.error("Couldn't upload at the moment.", {
                        position: 'top-center'
                    });
                }
                setLoading2(false);
                });
    }

    return(
        <div>
            <Header/> 
                {allowed
                ?
                <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Grade Cardd
                            </label>
                            <div className='flex gap-2 pt-2 items-center'>
                                {checkGrade
                                ?
                                <input
                                    type="file"
                                    name="gradeCard"
                                    disabled
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                    required
                                />
                                :
                                <input
                                    type="file"
                                    name="gradeCard"
                                    onChange={(e) => {setUploadGrade(e.target.files[0])}}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                    required
                                />}
                                {loading1
                                ?
                                <div className="w-1/4 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                                :
                                checkGrade
                                ?
                                <div className='w-1/4 flex items-center'>
                                    <Checkmark size='24px' color='green' />
                                </div>
                                :
                                <button
                                    onClick={handleGrade}
                                    className="w-1/4 flex justify-center h-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Upload
                                </button>}
                            </div>
                        </div>
                        <div className='py-4'>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload CV (Optional) -If not uploaded then cannot apply for projects in which CV is required.
                            </label>
                            <div className='flex gap-2 pt-2'>
                                {checkResume
                                ?
                                <input
                                    type="file"
                                    name="gradeCard"
                                    disabled
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                    required
                                />
                                :
                                <input
                                    type="file"
                                    name="cv"
                                    onChange={(e) => {setUploadResume(e.target.files[0])}}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                />}

                                {loading2
                                ?
                                <div className="w-1/4 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                                :
                                checkResume
                                ?
                                <div className='w-1/4 flex items-center'>
                                    <Checkmark size='24px' color='green' />
                                </div>
                                :
                                <button
                                    onClick={handlerResume}
                                    className="w-1/4 flex justify-center h-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Upload
                                </button>}
                            </div>
                        </div>
                        <Link
                            to="/btp/student/projects"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue
                        </Link>
                    </div>   
                </div> 
                :
                <div className="w-full flex justify-center mt-8 md:mt-20">
                    <div className="max-w-md bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold mb-4">404</h1>
                        <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for could not be accessed by you.</p>
                        <div className="bg-blue-500 text-center text-white text-xl font-bold py-2 px-4 rounded">
                            You are not part of this Course.
                        </div>
                    </div>
                </div>}
            </div>
    )
}

export default UploadComponent;
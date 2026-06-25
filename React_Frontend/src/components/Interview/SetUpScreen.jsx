

import React from 'react'
import { RxModulzLogo } from "react-icons/rx";
// import landingSVG from '../../images/landing_page.png'
import landingSVG from '../../assets/dashboard3.png'
import { FaUserDoctor } from "react-icons/fa6";
import { FaHospitalUser } from "react-icons/fa";
import { TbHeartRateMonitor } from "react-icons/tb";
import progress from "../../images/progress.png";
import assessment from "../../images/assessment.png";
import resume from "../../images/resume.png";
import performance from "../../images/performance.png";


import { LiaUsersSolid } from "react-icons/lia";
import { Link, useNavigate } from 'react-router-dom';

const SetUpScreen = () => {
    const navigate = useNavigate();
  return (
    <div className='relative h-screen w-screen bg-black text-white items-center flex '>
      
        <div className='absolute inset-4 border rounded-md border-blue-900/25 bg-red-900 bg-gradient-to-b from-[#00091E] to-[#000000] flex flex-col'>
                   <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[-10%] top-[30%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[-10%] top-[60%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
            <div className='navbar border rounded-full mt-5 mx-4 border-gray-800 bg-black/25  backdrop-blur-sm h-[4vw] flex justify-between items-center'>
                
                  <nav className='px-20 py-10 flex justify-between items-center w-full'>
             <div className="logo">
                 <h1 className='text-white text-2xl font=[Bungee] font-bold'>AI <span className='text-2xl font-[Bungee] text-blue-300 font-bold'>Coach</span></h1>
             </div>
             <div className='flex bg-[#343434]/60 text-[#EB73DD] font-[sixty] cursor-pointer text-xl flex gap-20 px-10 py-3 rounded-full'>
                 <p onClick={()=>navigate('/history')}>Review Interviews</p>
                 <p>Past Interviews Trend</p>
                 <p>Interview Tips</p>
             </div>
             <div className=''>
                 <img
             src="https://i.pravatar.cc/40"
             className="absolute right-20 top-4 w-12 h-12 rounded-full border border-white/20"
           />
             </div>
         </nav>
            </div>
            <div className='center flex flex-1 w-full px-30  pb-10 gap-5'>
                <div className='left flex-1 mt-10 mr-25'>
                    <div className='flex flex-col gap-10'>
                        <h1 className='text-7xl font-bold'>
                            Hi Anshu!!
                        </h1>
                        <h2 className='text-6xl text-wrap text-[#418AFF] font-bold'>
                            Every Interview Mastered.
                        </h2>
                        <p className='text-md font-bold text-gray-500 '>Practice realistic interviews with AI-powered assessments,<br/>personalized feedback, and performance analytics. Improve your <br/> technical skills, communication, and confidence—all in one place.</p>   
                        <div className='flex w-full flex-1 justify-between'>
                            <div className='flex flex-col gap-2 '>
                                <div className='h-[123px] w-[123px] bg-blue-800/25 rounded-full flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={performance}
                                        className='h-[120px] w-[120px] object-cover'
                                        alt=""
                                    />
                                </div>
                                <p className='text-sm text-center w-[160px]'>Instant Performance Feedback</p>
                            </div>
                             <div className='flex flex-col gap-2 '>
                                <div className='h-[123px] w-[123px] bg-blue-800/25 rounded-full flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={resume}
                                        className='h-[120px] w-[120px] object-cover'
                                        alt=""
                                    />
                                </div>
                                <p className='text-sm text-center w-[160px]'>Resume-Based Question Generation</p>
                            </div>
                             <div className='flex flex-col gap-2 '>
                                <div className='h-[123px] w-[123px] bg-blue-800/25 rounded-full flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={assessment}
                                        className='h-[120px] w-[120px] object-cover'
                                        alt=""
                                    />
                                </div>
                                <p className='text-sm text-center  w-[160px]'>Customized Assessments</p>
                            </div>
                             <div className='flex flex-col gap-2 '>
                                <div className='h-[123px] w-[123px] bg-blue-800/25 rounded-full flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={progress}
                                        className='h-[140px] w-[140px] object-contain'
                                        alt=""
                                    />
                                </div>
                                <p className='text-sm text-center w-[160px]'>Progress Tracking</p>
                            </div>
                        </div>    
                    </div>
                    <button onClick={()=>navigate('/upload')} className=' px-10 py-3 mt-10 rounded-md bg-[#3979E2] text-3xl cursor-pointer'>Get Started</button>
                </div>
                <div className='right  flex-1 rounded-3xl'>
                    <img src={landingSVG}  className="w-full h-full rounded-3xl p-5" alt="" />
                </div>

            </div>
          <div className='bottom mx-30 mb-10 px-12 py-6 rounded-xl bg-blue-800/20 backdrop-blur-sm border border-blue-500/10'>
            <div className='flex justify-between items-center'>

                <div className='flex items-center gap-4'>
                <LiaUsersSolid className='h-12 w-12 text-[#418AFF]' />
                <div>
                    <p className='text-3xl font-bold'>120+</p>
                    <p className='text-sm text-gray-400'>Happy Patients</p>
                </div>
                </div>

                <div className='flex items-center gap-4'>
                <FaUserDoctor className='h-12 w-12 text-[#418AFF]' />
                <div>
                    <p className='text-3xl font-bold'>1100+</p>
                    <p className='text-sm text-gray-400'>Expert Doctors</p>
                </div>
                </div>

                <div className='flex items-center gap-4'>
                <FaHospitalUser className='h-12 w-12 text-[#418AFF]' />
                <div>
                    <p className='text-3xl font-bold'>90+</p>
                    <p className='text-sm text-gray-400'>Hospitals</p>
                </div>
                </div>

                <div className='flex items-center gap-4'>
                <TbHeartRateMonitor className='h-12 w-12 text-[#418AFF]' />
                <div>
                    <p className='text-3xl font-bold'>99%+</p>
                    <p className='text-sm text-gray-400'>Satisfaction Rate</p>
                </div>
                </div>

            </div>
           </div>
        </div>
    </div>
  )
}

export default SetUpScreen;
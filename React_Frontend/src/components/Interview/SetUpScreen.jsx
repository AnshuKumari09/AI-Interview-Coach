// import { useState } from "react";
// import FileUpload from "./FileUpload";
// export default function SetupScreen({ onStart, loading }) {
//   const [mode, setMode] = useState("resume");
//   const [difficulty, setDifficulty] = useState("Medium");
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [qbankFile, setQbankFile] = useState(null);

//   const canStart =
//     (mode === "resume" && resumeFile) ||
//     (mode === "qbank" && qbankFile);

//   const handleStart = () => {
//     onStart({
//       mode,
//       difficulty,
//       numQuestions,
//       resumeFile,
//       qbankFile,
//     });
//   };

//   return (
//     <div className="bg-slate-900 p-10 rounded-3xl">
//       <h1 className="text-3xl font-bold">AI Interview Coach</h1>

//       {/* Mode */}
//       <div className="flex gap-3 mt-6">
//         <button onClick={() => setMode("resume")}>Resume</button>
//         <button onClick={() => setMode("qbank")}>QBank</button>
//       </div>

//       {/* Upload */}
//       {mode === "resume" ? (
//         <FileUpload
//           label="Upload Resume"
//           accept=".pdf"
//           file={resumeFile}
//           onChange={setResumeFile}
//         />
//       ) : (
//         <FileUpload
//           label="Upload QBank"
//           accept=".pdf,.txt"
//           file={qbankFile}
//           onChange={setQbankFile}
//         />
//       )}

//       {/* Difficulty */}
//       <div className="mt-5">
//         {["Easy", "Medium", "Hard"].map((d) => (
//           <button key={d} onClick={() => setDifficulty(d)}>
//             {d}
//           </button>
//         ))}
//       </div>

//       {/* Questions */}
//       <input
//         type="range"
//         min={1}
//         max={20}
//         value={numQuestions}
//         onChange={(e) => setNumQuestions(e.target.value)}
//       />

//       <button
//         onClick={handleStart}
//         disabled={!canStart || loading}
//         className="mt-6 bg-violet-600 px-6 py-3 rounded-xl"
//       >
//         Start Interview
//       </button>
//     </div>
//   );
// }





// import ai from '../../images/ai.png'
// import { MdCreditScore } from "react-icons/md";
// import React from 'react'
// import { FaPlay } from "react-icons/fa";
// import { FaArrowRight } from "react-icons/fa";

// const SetUpScreen = () => {
//   return (
//     <div className='h-screen w-screen bg-black overflow-hidden'>
//         <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-[#0351FA] rounded-full blur-[200px] opacity-60" />
//         <div className="absolute right-[-10%] top-[30%] w-[500px] h-[500px] bg-[#0351FA] rounded-full blur-[200px] opacity-60" />
//         <div className="absolute right-[-10%] top-[60%] w-[500px] h-[500px] bg-[#0351FA] rounded-full blur-[200px] opacity-60" />
//         <nav className='px-20 py-10 flex justify-between w-full'>
//             <div className="logo">
//                 <h1 className='text-white text-2xl font=[Bungee] font-bold'>AI <span className='text-2xl font-[Bungee] text-blue-300 font-bold'>Coach</span></h1>
//             </div>
//             <div className='flex bg-[#343434]/60 text-[#EB73DD] font-[sixty] text-xl flex gap-20 px-10 py-3 rounded-full'>
//                 <p>Review Interviews</p>
//                 <p>Past Interviews Trend</p>
//                 <p>Interview Tips</p>
//             </div>
//             <div className=''>
//                 <img
//             src="https://i.pravatar.cc/40"
//             className="absolute right-20 top-10 w-12 h-12 rounded-full border border-white/20"
//           />
//             </div>
//         </nav>
//         <div className='h-screen w-full rounded-sm px-10'>
//             {/* <div className='bg-[#EB73DD]/7 rounded-lg flex flex-col'>
//                 <div className='flex flex-col mt-10  gap-5'>
//                     <div className="card bg-blue-900/20 flex py-10 justify-between px-8 items-center text-white rounded-lg border border-blue-900/20">
//                     <MdCreditScore className="text-white text-3xl"/>
//                     <p className='text-xl'>Best Score</p>
//                     <p className='text-xl'>20</p>
//                     </div>
//                     <div className="list w-full bg-blue-900/10 mt-3 mb-20">
//                         <div className='flex justify-between py-3 px-6 mb-3 rounded rounded-xl items-center bg-[#EB73DD]/20'>
//                             <h1 className='text-white '>React js interview practice</h1>
//                             <FaArrowRight className='text-white'/>
//                         </div>
//                         <div className='flex justify-between py-3 px-6 mb-3 rounded rounded-xl items-center bg-[#EB73DD]/20'>
//                             <h1 className='text-white '>React js interview practice</h1>
//                             <FaArrowRight className='text-white'/>
//                         </div>
//                         <div className='flex justify-between py-3 px-6 mb-3 rounded rounded-xl items-center bg-[#EB73DD]/20'>
//                             <h1 className='text-white '>React js interview practice</h1>
//                             <FaArrowRight className='text-white'/>
//                         </div>
//                         <div className='flex justify-between py-3 px-6 mb-3 rounded rounded-xl items-center bg-[#EB73DD]/20'>
//                             <h1 className='text-white '>React js interview practice</h1>
//                             <FaArrowRight className='text-white'/>
//                         </div>
//                         <div className='flex justify-between py-3 px-6 mb-3 rounded rounded-xl items-center bg-[#EB73DD]/20'>
//                             <h1 className='text-white '>React js interview practice</h1>
//                             <FaArrowRight className='text-white'/>
//                         </div>
//                     </div>
//                     <div className="card bg-blue-900/20 flex py-10 justify-between px-8 items-center text-white rounded-lg border border-blue-900/20">
//                     <MdCreditScore className="text-white text-3xl"/>
//                     <p className='text-xl'>Total Interview Taken</p>
//                     <p className='text-xl'>20</p>
//                     </div>
//                     <div className="card bg-blue-900/20 flex py-10 justify-between px-8 items-center text-white rounded-lg border border-blue-900/20">
//                     <MdCreditScore className="text-white text-3xl"/>
//                     <p className='text-xl'>Recommended Practice</p>
//                     <p className='text-xl'>20</p>
//                     </div>
//                 </div>
//             </div> */}
//             <div className="text-center mt-16">
//                 <h2 className="text-6xl text-white font-[Black_Ops] mb-20 font-semibold">HI Anshu!!</h2>
//                 <p className='text-white text-xl mb-10'>Practice smarter with AI-driven mock interviews, personalized assessments, and actionable feedback. Build confidence and get interview-ready faster.</p>
//                 <p className="text-gray-400 font-[sixty] mb-10 text-2xl">
//                     BOOST YOUR PROGRESS WITH YOUR
//                 </p>
//                 <div className="relative flex flex-col gap-10 items-center">

//                     <h1
//                         className="
//                         text-9xl
//                         font-[Bungee]
//                         font-extrabold
//                         tracking-wide
//                         text-transparent
//                         bg-clip-text
//                         bg-gradient-to-r
//                         from-blue-400
//                         to-purple-500
//                         relative
//                         z-0
//                         "
//                     >
//                         AI COACH
//                     </h1>

//                     {/* Image - Front */}
//                     <div
//                         className="group 
//                         relative
//                         -mt-0
//                         z-20
//                         w-[850px]
//                         h-[420px]
//                         rounded-3xl
//                         bg-white/10
//                         backdrop-blur-xl
//                         border border-white/20
//                         "
//                     >
//                         <img
//                         src={ai}
//                         className="w-full h-full object-contain"
//                         alt=""
//                         />
//                         <button
//                             onClick={() => {
//                                 console.log("Play clicked");
//                                 // Yahan modal/video open karna hai
//                             }}
//                             className="
//                                 absolute
//                                 inset-0
//                                 flex
//                                 items-center
//                                 justify-center
//                                 opacity-0
//                                 group-hover:opacity-100
//                                 transition-all
//                                 duration-300
//                                 bg-black/20
//                                 backdrop-blur-sm
//                             "
//                         >
//                             <div
//                                 className="
//                                     w-20
//                                     h-20
//                                     rounded-full
//                                     bg-white/20
//                                     backdrop-blur-md
//                                     border
//                                     border-white/30
//                                     flex
//                                     items-center
//                                     justify-center
//                                     hover:scale-110
//                                     transition
//                                 "
//                             >
//                                 <FaPlay className="text-white text-3xl ml-1" />
//                             </div>
//                         </button>
//                          <div className="absolute top-4 left-4 flex items-center gap-2">
//                             <img
//                                 src="https://i.pravatar.cc/40"
//                                 alt="profile"
//                                 className="w-9 h-9 rounded-full border-2 border-white/40"
//                             />
//                         </div>

//                         {/* Progress Bar */}
//                         <div className="absolute bottom-4 left-4 right-4">
//                             <div className="h-1 bg-white/20 rounded-full ">
//                                 <div className="w-[25%] h-full bg-blue-500 rounded-full"></div>
//                             </div>
//                         </div>

//                         <div className="absolute inset-0 bg-black/5 " />
//                     </div>

//                 </div>
                
//             </div>
//         </div>
        
//     </div>
//   )
// }

// export default SetUpScreen


import React from 'react'
import { RxModulzLogo } from "react-icons/rx";
import landingSVG from '../../images/landing_page.png'
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
             <div className='flex bg-[#343434]/60 text-[#EB73DD] font-[sixty] text-xl flex gap-20 px-10 py-3 rounded-full'>
                 <p>Review Interviews</p>
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
                    <button onClick={()=>navigate('/upload')} className=' px-10 py-3 mt-10 rounded-md bg-[#3979E2] text-3xl'>Get Started</button>
                </div>
                <div className='right  flex-1'>
                    <img src={landingSVG}  className="w-full h-full " alt="" />
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
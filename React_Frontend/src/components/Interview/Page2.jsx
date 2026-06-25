// import { Upload, FileText, CheckCircle } from "lucide-react";

// export default function FileUpload({ label, accept, file, onChange }) {
//   return (
//     <div>
//       <label className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center cursor-pointer">
//         <Upload size={40} className="text-slate-500" />
//         <p className="mt-3 text-slate-300">{label}</p>

//         <input
//           type="file"
//           accept={accept}
//           className="hidden"
//           onChange={(e) => onChange(e.target.files[0])}
//         />
//       </label>

//       {file && (
//         <div className="mt-3 flex items-center gap-3 bg-slate-800 p-3 rounded-xl">
//           <FileText size={18} />
//           <span className="text-sm truncate">{file.name}</span>
//           <CheckCircle className="text-green-400 ml-auto" />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from 'react'
import Sidebar from '../common/Sidebar'
import UploadCard from '../upload/UploadCards';
import UploadOptions from '../upload/UploadOptions';
import InterViewConfiguration from '../upload/InterViewConfiguration';
import { FiUploadCloud } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// const BACKEND_URL = "http://localhost:8000"
const BACKEND_URL = "https://ai-interview-coach-0mp0.onrender.com"

const Page2 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [error, setError] = useState("");
    const [mode, setMode] = useState("resume"); // "resume" | "qbank"
    const [difficulty, setDifficulty] = useState("Medium");
    const [numQuestions, setNumQuestions] = useState(5);

    const handleContinue = ()=>{
        navigate('/interview',{
            state:{
                mode,
                resumeFile,
                pdfFile,
                difficulty,
                numQuestions,
            }
        })
    }

  return (
    <div className='bg-black min-h-screen w-screen flex justify-start gap-[10vw]'>
        <div className="absolute right-[0%] top-[-10%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[30%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[60%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
         <div className="absolute right-[80%] top-[0%] w-[500px] h-[500px] bg-[#6C04A7] rounded-full blur-[200px] opacity-60" />
            
        <div className='w-[280px] h-screen sticky top-0 shrink-0 border-white/10'>
            <Sidebar />
        </div>
        <div className='text-white mt-[2vw]  w-full flex flex-col gap-[2vw] items-center '>
            <h1 className='text-5xl font-bold text-blue-300'>Create Interviews Your Way</h1>
            <p className='text-yellow-200'>Upload your resume Or custom pdf question bank and let AI craft a personalized interview for you.</p>
            <div className="flex gap-25">
                {UploadOptions.map((option) => (
                    <UploadCard
                    key={option.id}
                    {...option}
                     file={
                        option.id === "resume"
                        ? resumeFile
                        : pdfFile
                    }
                    // key={option.id}
                    // {...option}
                    
                    onUpload={(e) => {
                        const file = e.target.files[0];

                       if (!file) return;

                        if (option.id === "resume") {
                            setMode("resume");
                            setResumeFile(file);
                            setPdfFile(null);
                        } else {
                            setMode("qbank");
                            setPdfFile(file);
                            setResumeFile(null);
                        }
                          console.log("Resume:", resumeFile);
                          console.log("PDF:", pdfFile);
                    }}
                    buttonText="Upload"
                    color="from-blue-500 to-cyan-500"
                    icon={<FiUploadCloud size={40} />}
                    />
                ))}
            </div>
            <div className='w-[80%] mb-10'>
                <InterViewConfiguration difficulty={difficulty} setDifficulty={setDifficulty}  numQuestions={numQuestions} setNumQuestions={setNumQuestions}/>
            </div>
           <button onClick={handleContinue} disabled={loading} className="w-[60%] h-[100px] rounded-full bg-blue-800/30 border border-gray-200/30 mb-20">
            {loading ? "Starting..." : "Start Interview"}
           </button>
        </div>
    </div>
  )
}

export default Page2
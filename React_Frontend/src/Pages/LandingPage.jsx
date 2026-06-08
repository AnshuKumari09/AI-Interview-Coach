import React from 'react'
import { Link } from 'react-router-dom'
import robot from '../images/Robot.png'

const LandingPage = () => {
  return (
    <div className='relative h-screen w-screen bg-black'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_5%_2%,#6d28d9_0%,transparent_20%)] opacity-25'></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2%_70%,#B9008B_0%,transparent_20%)] opacity-20"></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_bottom,#6d28d9_0%,transparent_20%)] opacity-25'></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_70%,#B9008B_0%,transparent_20%)] opacity-20"></div>
        <div className='absolute border border-gray-500 inset-5 rounded-lg bg-white/5'>
          
            <div className='flex px-20 py-10 justify-between'>
                <h1 className='text-3xl text-[#EB73DD] font-bold '>AI Coach</h1>
                <div className='flex text-white gap-25'>
                    <Link to="/login" className='btn1  z-[9999] flex px-6 py-1 border border-[#221B8F] rounded-lg items-center justify-center'>
                        Login
                    </Link>
                    <Link to="/signup"  className="btn1  z-[9999] flex px-6 text-white py-1 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9)_10%,#221B8F_70%)] items-center justify-center text-black rounded-lg">
                        Signup
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col mt-0 justify-start items-center">
                <svg
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
                    viewBox="0 0 800 300"
                    fill="none"
                    >
                    <path
                        // d="M0 150
                        // C120 40, 220 40, 350 150
                        // C480 260, 580 260, 800 150"
                        d="M0 150 L300 150 C370 140,300 350, 460 150 L900 150
                        "
                        stroke="white"

                        strokeWidth="2"
                        opacity="0.8"
                    />
                </svg>
                <img
                    src={robot}   // put your image in public folder
                    alt="AI Robot"
                    className="w-[900px]  drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                />
                <div className='text-gray-400 flex top-80 justify-between w-full px-20 absolute'>
                    <div className='text-xl text-center'>Practice real interview questions, get <br/> instant feedback, and improve your answers  <br/> like never before.</div>
                    <div className='text-xl text-center'>Set your practice level, face timed  <br/> interviews, and improve with AI  <br/> insights.</div>
                </div>
                <h1 className='text-white text-5xl '>Your AI-powered interview coach is ready <br/> to elevate your confidence.</h1>
            </div>
        </div>

    </div>
  )
}

export default LandingPage
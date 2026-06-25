import React from 'react'
import { Link } from 'react-router-dom'
import landing from '../images/landing.png'

const LandingPage = () => {
  return (
    <div className='relative h-screen w-screen bg-black'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_5%_2%,#6d28d9_0%,transparent_20%)] opacity-25'></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2%_70%,#B9008B_0%,transparent_20%)] opacity-20"></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_bottom,#6d28d9_0%,transparent_20%)] opacity-25'></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_70%,#B9008B_0%,transparent_20%)] opacity-20"></div>
        <div className='absolute border border-gray-500 inset-5 rounded-lg bg-white/5'>
          
            <nav className="relative z-20 flex items-center justify-between px-16 py-8">

            <h1 className="text-4xl font-bold">
                <span className="text-violet-400">AI</span>
                <span className="text-white">Coach</span>
            </h1>

            <div className="flex items-center  text-xl gap-10">

                <Link
                to="/login"
                className="px-5 py-2 border border-white/20 rounded-xl text-white hover:bg-white/10 transition"
                >
                Login
                </Link>

                <Link
                to="/signup"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium"
                >
                Get Started
                </Link>

            </div>

            </nav>
            <section className="relative z-10 w-full mx-auto px-16 pt-10">

                <div className="grid lg:grid-cols-2 items-center gap-20">

                    {/* Left */}

                    <div>

                    <span className="inline-flex px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-lg">
                        AI-Powered Interview Training
                    </span>

                    <h1 className="mt-6 text-8xl font-bold text-white leading-tight">

                        Ace Every
                        <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                        {" "}Interview
                        </span>

                        <br />
                        With AI Guidance

                    </h1>

                    <p className="mt-6 text-2xl text-gray-400 max-w-2xl">
                        Practice technical, HR, and behavioral interviews with an AI interviewer that evaluates your answers and provides instant feedback.
                    </p>

                    <div className="flex gap-5 text-xl mt-8">

                        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold">
                        Start Free
                        </button>

                        <button className="px-8 py-4 rounded-xl border border-white/20 text-white">
                        Watch Demo
                        </button>

                    </div>

                    <div className="flex gap-8 mt-10">

                        <div>
                        <h3 className="text-3xl font-bold text-white">
                            10K+
                        </h3>
                        <p className="text-gray-400 text-xl">
                            Interviews Practiced
                        </p>
                        </div>

                        <div>
                        <h3 className="text-3xl font-bold text-white">
                            95%
                        </h3>
                        <p className="text-gray-400 text-xl">
                            Confidence Boost
                        </p>
                        </div>

                    </div>

                    </div>

                    {/* Right */}

                    <div className="relative flex justify-center">

                    <div className="absolute w-96 h-96 bg-violet-600/30 blur-[150px]" />

                    <img
                        src={landing}
                        alt=""
                        className="relative z-10 w-[1050px]"
                    />

                    </div>

                </div>

            </section>
        </div>

    </div>
  )
}

export default LandingPage
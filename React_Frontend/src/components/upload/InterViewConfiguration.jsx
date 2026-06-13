import React from 'react'

const difficultyColors = {
  Easy: "border-gray-500 text-green-400 hover:bg-green-500/10 hover:border-green-500",
  Medium: "border-gray-500 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500",
  Hard: "border-gray-500 text-red-400 hover:bg-red-500/10 hover:border-red-500",
};

const InterViewConfiguration = ({ difficulty,setDifficulty,numQuestions,setNumQuestions}) => {
  return (
    <div className="bg-[#0A1025] border border-white/10 h-full w-full rounded-3xl p-8">

    <h2 className="text-2xl text-[#EB73DD] font-semibold  mb-8">
        Interview Configuration
    </h2>

    {/* Interview Type */}
    {/* <div className="mb-8">
        <h3 className="text-blue-300 mb-4">
            Interview Type
        </h3>

        <div className="flex gap-10 flex-wrap">
            {["Technical", "HR", "Behavioral", "Mixed"].map((item) => (
                <button
                    key={item}
                    className="
                    px-6 py-3 rounded-xl
                    bg-white/5
                    border border-white/10
                    text-white
                    hover:border-blue-500
                    hover:bg-blue-500/10
                    transition-all
                    "
                >
                    {item}
                </button>
            ))}
        </div>
    </div> */}

    {/* Difficulty */}
   <div className='flex gap-40'>
    <div className='flex flex-col'>
         <div className="mb-8">
        <h3 className="text-blue-300 mb-4">
            Difficulty Level
        </h3>

        <div className="flex gap-8">
            {["Easy", "Medium", "Hard"].map((item) => (
            <button
                key={item}
                onClick={()=>setDifficulty(item)}
                className={`
                px-6 py-3 rounded-xl
                bg-white/5
                border
                transition-all
                ${difficultyColors[item]}
                ${difficulty===item ? "ring-2 ring-white scale-105":"bg-white/5"}
                `}
            >
                {item}
            </button>
            ))}
        </div>
        </div>

    {/* Questions */}
        <div>
            <h3 className="text-blue-300 mb-4">
                Number of Questions
            </h3>

            <div className="flex gap-4 flex-wrap">
                {[5, 10, 15, 20].map((item) => (
                    <button
                        key={item}
                        onClick={() => setNumQuestions(item)}
                        className={`
                        min-w-[80px]
                        py-3 rounded-xl border transition-all
                        ${
                            numQuestions === item
                            ? "bg-blue-600 border-blue-500"
                            : "bg-white/5 border-white/10"
                        }
                        `}
                    >
                        {item}
                    </button>
                    ))}
            </div>
        </div>
    </div>
    <div className='text-4xl leading-[-2vw] text-blue-300 font-bold'>
        Get Ready<br/> you are confident!!
    </div>
   </div>

</div>
  )
}

export default InterViewConfiguration
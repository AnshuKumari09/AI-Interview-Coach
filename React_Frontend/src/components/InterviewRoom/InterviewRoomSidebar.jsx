import React, { useEffect, useRef, useState } from 'react'
import { BsRobot } from "react-icons/bs";
 import { useLocation } from "react-router-dom";

 function stripLeadingNumber(text = "") {
  return text.replace(/^([Qq]?\d+[\.\)]\s*)+/, "").trim();
}

const InterviewRoomSidebar = ({ conversations=[] }) => {


const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [conversations]);
      // const interviewData = JSON.parse(
      //   localStorage.getItem("interviewData")
      // );

      // console.log(interviewData);
      console.log(conversations);
      console.log(typeof conversations);
    
  return (
     <div className="w-[780px] border-r border-white/10 bg-[#0D0D23] flex flex-col">
              {/* Logo */}
              <div className="h-16 flex items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BsRobot className="text-2xl text-violet-400" />
                  <h1 className="font-semibold text-lg">AICoach</h1>
                </div>
              </div>
    
              {/* Conversations */}
              <div className="flex-1 overflow-y-auto p-5">
                <h3 className="text-lg text-gray-400 mb-6">
                  Conversations
                </h3>
              
                <div className="space-y-6">
                  <div className="space-y-6">

                  {conversations.length === 0 ? (
                    <div className="text-gray-500 text-center mt-10">
                      Waiting for interview...
                    </div>
                  ) : (
                    conversations.map((item, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        item.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div ref={messagesEndRef}
                        className={`max-w-[85%] rounded-2xl p-4 ${
                          item.role === "user"
                            ? "bg-violet-600"
                            : item.type === "review"
                            ? "bg-green-700"
                            : "bg-[#1A1A35]"
                        }`}
                      >
                        <p className="text-lg opacity-70 mb-1 font-medium">
                          {item.role === "user"
                            ? "You"
                            : item.type === "review"
                            ? "AI Review"
                            : "Interview Bot"}
                        </p>

                        <p className="text-xl">
                          {item.type === "question"
                            ? stripLeadingNumber(item.message)
                            : item.message}
                        </p>
                      </div>
                    </div>
                  ))
                  )}
                    
                </div>
                </div>
              </div>
            </div>
    
  )
}

export default InterviewRoomSidebar
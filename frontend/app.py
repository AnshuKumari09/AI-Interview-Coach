import streamlit as st
import requests
from streamlit_mic_recorder import mic_recorder
import tempfile
import threading  
import plotly.express as px
import pandas as pd 
import time
import re
BACKEND_URL = "http://127.0.0.1:8000"

st.title("AI Interview Coach")

menu = st.sidebar.selectbox(
    "Menu",
    [
        "Signup",
        "Login",
        "Start Interview",
        "Interview History"    
    ]
)
def speak_async(text):
    requests.post(
        f"{BACKEND_URL}/ai-speak",
        json={"text": text}
    )
# ---------------- SIGNUP ----------------

if menu == "Signup":

    st.header("Signup")

    email = st.text_input("Email")

    password = st.text_input(
        "Password",
        type="password",
        key="signup_password"
    )

    if st.button("Create Account"):

        response = requests.post(
            f"{BACKEND_URL}/signup",
            params={
                "email": email,
                "password": password
            }
        )

        if response.status_code == 200:
            st.success("Account Created Successfully")
        else:
            st.error(response.text)

# ---------------- INTERVIEW HISTORY ----------------
elif menu == "Interview History":

    st.header("📋 Interview History")

    if "token" not in st.session_state:
        st.error("Please login first")

    else:
        headers = {
            "Authorization":
            f"Bearer {st.session_state['token']}"
        }

        response = requests.get(
            f"{BACKEND_URL}/my-interviews",
            headers=headers
        )

        if response.status_code == 200:
            interviews = response.json()

            if len(interviews) == 0:
                st.info("No interviews found. Start your first interview!")

            else:
                st.success(f"Total Interviews: {len(interviews)}")

                # ✅ Score Trend Chart
                completed = [
                    i for i in interviews
                    if i["score"] is not None and i["total_questions"] > 0
                ]

                if len(completed) > 0:
                    df = pd.DataFrame({
                        "Interview": list(range(1, len(completed) + 1)),
                        "Score": [i["score"] for i in completed]
                    })

                    fig = px.line(
                        df,
                        x="Interview",
                        y="Score",
                        title="📈 Score Trend",
                        markers=True,
                        line_shape="spline"
                    )

                    fig.update_layout(
                        yaxis_range=[0, 10],
                        yaxis_title="Score (out of 10)",
                        xaxis_title="Interview",
                        hovermode="x"
                    )

                    st.plotly_chart(fig, use_container_width=True)

                st.markdown("---")

                # ✅ Interview Cards
             
                completed_interviews = [
                    i for i in interviews
                    if i["score"] is not None and i["total_questions"] > 0
                ]
                st.write(f"Completed Interviews: {len(completed_interviews)}")
                for interview in completed_interviews:
                    with st.expander(
                        f"🗓 Interview #{interview['session_id']} "
                        f"| Score: {interview['score'] or 'N/A'}/10 "
                        f"| Questions: {interview['total_questions']}"
                    ):
                        st.write(
                            f"**Completed At:** {interview['completed_at']}"
                        )
                        st.write(
                            f"**Score:** {interview['score']}/10"
                        )
                        st.write(
                            f"**Questions Answered:** {interview['total_questions']}"
                        )

                        if st.button(
                            "View Details",
                            key=f"detail_{interview['session_id']}"
                        ):
                            detail_response = requests.get(
                                f"{BACKEND_URL}/interview-summary/{interview['session_id']}",
                                headers=headers
                            )

                            if detail_response.status_code == 200:
                                detail = detail_response.json()

                                for i, q in enumerate(
                                    detail["questions"], start=1
                                ):
                                    st.markdown(f"**Q{i}: {q['question']}**")
                                    st.write(f"Your Answer: {q['answer']}")
                                    st.info(q['evaluation'])
                                    st.write(f"Score: {q['score']}/10")
                                    st.markdown("---")
        else:
            st.error("Failed to fetch interviews")
# ---------------- LOGIN ----------------

elif menu == "Login":

    st.header("Login")

    email = st.text_input("Email")

    password = st.text_input(
        "Password",
        type="password",
        key="login_password"
    )

    if st.button("Login"):

        response = requests.post(
            f"{BACKEND_URL}/login",
            params={
                "email": email,
                "password": password
            }
        )

        if response.status_code == 200:

            token = response.json()["access_token"]

            st.session_state["token"] = token

            st.success("Login Successful")

        else:
            st.error("Login Failed")


# ---------------- START INTERVIEW ----------------

elif menu == "Start Interview":
    difficulty = st.selectbox(   
    "Select Difficulty Level",
    ["Easy", "Medium", "Hard"],
    key="difficulty"
    )
    num_questions = st.number_input(
        "Number of Questions",
        min_value=1,
        max_value=20,
        value=5,
        step=1
    )

    st.header("Start Interview")
    interview_mode = st.radio(
        "Interview Mode",
        ["Resume Based", "Question Bank"],
        horizontal=True
    )

    if interview_mode == "Question Bank":
        question_bank = st.file_uploader(
            "Upload Question Bank (PDF/TXT)",
            type=["pdf", "txt"]
        )
        uploaded_file = None

    else:
        uploaded_file = st.file_uploader(
        "Upload Resume",
        type=["pdf"],
        key="interview_resume"
        )
        question_bank = None
        


    if "recording_key" not in st.session_state:
        st.session_state["recording_key"] = 0

    if st.button("Start Interview"):
        st.session_state["time_limit"] = 120
        st.session_state["timer_start"] = time.time() 
        st.session_state["recording_key"] += 1

        if "last_evaluation" in st.session_state:
            del st.session_state["last_evaluation"]
        if "voice_text" in st.session_state:
            del st.session_state["voice_text"]
        if "processed_audio" in st.session_state:
            del st.session_state["processed_audio"]
        if "answer_text" in st.session_state:
            del st.session_state["answer_text"]
        if "question" in st.session_state:
            del st.session_state["question"]
        if "session_id" in st.session_state:
            del st.session_state["session_id"]
        if "db_session_id" in st.session_state:
            del st.session_state["db_session_id"]
        if "pending_next_question" in st.session_state:
            del st.session_state["pending_next_question"]
        if "interview_done" in st.session_state:
            del st.session_state["interview_done"]
        if "final_result" in st.session_state:
            del st.session_state["final_result"]

        if "token" not in st.session_state:
            st.error("Please login first")
            st.stop()

        if interview_mode == "Resume Based" and uploaded_file is None:
            st.error("Please upload resume")

        elif interview_mode == "Question Bank" and question_bank is None:
            st.error("Please upload question bank")

        else:
            headers = {
                "Authorization":
                f"Bearer {st.session_state['token']}"
            }
           
            with st.spinner("Preparing interview... Please wait ⏳"):
                if interview_mode == "Question Bank":
                            files = {
                                # "resume": (
                                #     uploaded_file.name,
                                #     uploaded_file,
                                #     "application/pdf"
                                # ),

    
                                "qbank": (
                                
                                    question_bank.name,
                                    question_bank,
                                    "application/pdf" if question_bank.name.endswith(".pdf") else "text/plain"
                                )
                            }
                
                            response = requests.post(
                                f"{BACKEND_URL}/start-interview-qbank",
                                headers=headers,
                                files=files,
                                params={
                                    "difficulty": difficulty,
                                    "num_questions": num_questions
                                }
                            )
                else:
                    files = { 
                        "file": (
                            uploaded_file.name,
                            uploaded_file,
                            "application/pdf"
                        )
                    }
                
                    response = requests.post(
                        f"{BACKEND_URL}/start-interview",
                        headers=headers,
                        files=files,
                        params={"difficulty": difficulty}
                    )
            try:
                data = response.json()
            except Exception:
                st.error(f"Backend returned non-JSON response:\n{response.text}")
                st.stop()
            print("STATUS:", response.status_code)
            print("TEXT:", response.text)
            if response.status_code != 200:
                st.error(data)
                st.stop()
            if "session_id" not in data:
                st.error(f"Unexpected response: {data}")
                st.stop()

            st.session_state["session_id"] = data["session_id"]
            st.session_state["db_session_id"] = data["db_session_id"]
            st.session_state["question"] = data["first_question"]
            st.session_state["total_questions"] = data.get("total_questions", 5)
            st.session_state["current_question_num"] = 1

            threading.Thread(
                target=speak_async,
                args=(data["intro"] + "\n\n" + data["first_question"],)
            ).start()

    # ---- Interview Complete Screen ----
    if st.session_state.get("interview_done"):

        result = st.session_state.get("final_result", {})

        st.balloons()
        st.success("🎉 Interview Completed Successfully!")

        if "last_evaluation" in st.session_state:
            st.markdown("### 📊 Last Answer Feedback")
            st.markdown(st.session_state["last_evaluation"])

        if "summary" in result:
            summary = result["summary"]
            st.markdown("## Interview Summary")
            st.metric("Questions Answered", summary["total_questions"])
            st.metric("Average Score", f"{summary['average_score']}/10")
            st.info(summary["feedback"])

        st.markdown("---")
        avg = result.get("summary", {}).get("average_score", 0)
        if avg >= 8:
                st.success("""
                           
                           ### 🌟 Outstanding Performance!
                           You demonstrated strong technical knowledge.
                           You are well prepared for real interviews.
                           Keep it up! 🚀

                           """)
        elif avg >= 5:
                st.success("""
                           
                           ### 💪 Good Effort!
                           You have a solid foundation.
                           Focus on explaining concepts more clearly and precisely.
                           Practice daily and you will ace your interviews! 🎯
                          """)
                
        else:
                st.success("""
                           ### 🌱 Keep Practicing!
                           Every expert was once a beginner.
                           Review the correct answers above and practice again.
                           Consistency is the key to success! 💡
                           """)
        if st.button("🔄 Practice Again"):
            keys_to_clear = [
                "question", "voice_text", "answer_text",
                "processed_audio", "session_id", "db_session_id",
                "last_evaluation", "pending_next_question",
                "interview_done", "final_result"
            ]
            for key in keys_to_clear:
                if key in st.session_state:
                    del st.session_state[key]

            st.session_state["recording_key"] += 1
            st.rerun()

# ---- Question Screen ----
    elif "question" in st.session_state:
        current = st.session_state.get("current_question_num", 1)
        total = st.session_state.get("total_questions", 5)
        st.progress(
            current / total,
            text=f"Question {current} of {total}"
        )
    # ---- Camera Feed ----
        st.components.v1.html(
            """
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                <div style="position: relative; width: 160px; height: 120px;">
                    <video 
                        id="camera" 
                        autoplay 
                        muted 
                        playsinline
                        style="
                            width: 160px; 
                            height: 120px; 
                            border-radius: 12px; 
                            object-fit: cover;
                            border: 1px solid #334155;
                        "
                    ></video>
                    <div style="
                        position: absolute; 
                        top: 8px; 
                        left: 8px;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    ">
                        <div style="
                            width: 8px; 
                            height: 8px; 
                            background: #ef4444; 
                            border-radius: 50%;
                            animation: pulse 1.5s infinite;
                        "></div>
                        <span style="color: white; font-size: 11px;">Live</span>
                    </div>
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            </style>

            <script>
                async function startCamera() {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ 
                            video: true, 
                            audio: false 
                        });
                        const video = document.getElementById("camera");
                        video.srcObject = stream;
                    } catch (err) {
                        console.log("Camera error:", err);
                    }
                }
                startCamera();
            </script>
            """,
            height=140
        )


        # Timer display
        time_limit = st.session_state.get("time_limit", 120)
        elapsed = int(time.time() - st.session_state.get("timer_start", time.time()))
        remaining = max(0, time_limit - elapsed)

        st.components.v1.html(
            f"""
            <div id="timer" style="
                font-size: 24px;
                font-weight: bold;
                padding: 10px;
                border-radius: 8px;
                text-align: center;
                background-color: #1e1e1e;
                color: white;
            ">
                ⏱ <span id="time">00:00</span>
            </div>

            <script>
                var remaining = {remaining};
                
                function updateTimer() {{
                    if (remaining <= 0) {{
                        document.getElementById("time").innerText = "Time Up!";
                        document.getElementById("timer").style.backgroundColor = "red";
                        return;
                    }}
                    
                    var minutes = Math.floor(remaining / 60);
                    var seconds = remaining % 60;
                    
                    document.getElementById("time").innerText = 
                        String(minutes).padStart(2, '0') + ':' + 
                        String(seconds).padStart(2, '0');
                    
                    if (remaining <= 30) {{
                        document.getElementById("timer").style.backgroundColor = "#ff4444";
                    }} else {{
                        document.getElementById("timer").style.backgroundColor = "#1e1e1e";
                    }}
                    
                    remaining--;
                    setTimeout(updateTimer, 1000);
                }}
                
                updateTimer();
            </script>
            """,
            height=70
        )

        st.subheader("Question")
        question_text = st.session_state["question"]
        question_text = re.sub(r'^[Qq]?\d+[\.\)]\s*', '', question_text).strip()
        st.write(question_text)

        if st.button("🔊 Speak Question", key="speak_question"):
            threading.Thread(
                target=speak_async,
                args=(st.session_state["question"],)
            ).start()

        # ---- Feedback + Next Question (after submit) ----
        if (
            "last_evaluation" in st.session_state
            and "pending_next_question" in st.session_state
        ):
            st.markdown("---")
            st.markdown("### 📊 Your Feedback")
            st.markdown(st.session_state["last_evaluation"])
            if st.session_state.get("is_followup", False):
                st.info("🔍 Interviewer wants to know more...")

            if st.button("Next Question →"):
                st.session_state["timer_start"] = time.time()
                if not st.session_state.get("is_followup", False):
                    st.session_state["current_question_num"] = (
                        st.session_state.get("current_question_num", 1) + 1
                    )
                
                next_q = st.session_state["pending_next_question"]

                st.session_state["question"] = next_q
                st.session_state["is_followup"] = False

                if "voice_text" in st.session_state:
                    del st.session_state["voice_text"]
                if "answer_text" in st.session_state:
                    del st.session_state["answer_text"]
                if "processed_audio" in st.session_state:
                    del st.session_state["processed_audio"]
                if "last_evaluation" in st.session_state:
                    del st.session_state["last_evaluation"]
                if "pending_next_question" in st.session_state:
                    del st.session_state["pending_next_question"]

                st.session_state["recording_key"] += 1

                threading.Thread(
                    target=speak_async,
                    args=(next_q,)
                ).start()

                st.rerun()

        # ---- Answer Section ----
        else:
            answer = st.text_area(
                "Your Answer",
                key="answer_text"
            )

            st.write("### Voice Answer")

            if "recording_key" not in st.session_state:
                st.session_state["recording_key"] = 0

            audio = mic_recorder(
                start_prompt="🎙 Start Recording",
                stop_prompt="⏹ Stop Recording",
                key=f"recorder_{st.session_state['recording_key']}"
            )

            if audio and "processed_audio" not in st.session_state:
                with tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix=".wav"
                ) as temp_audio:
                    temp_audio.write(audio["bytes"])
                    temp_audio_path = temp_audio.name

                with open(temp_audio_path, "rb") as f:
                    files = {
                        "file": ("answer.wav", f, "audio/wav")
                    }
                    response = requests.post(
                        f"{BACKEND_URL}/transcribe-audio",
                        files=files
                    )

                if response.status_code == 200:
                    transcription = response.json()["transcription"]
                    st.session_state["voice_text"] = transcription
                    st.session_state["processed_audio"] = True
                    st.rerun()

            if "voice_text" in st.session_state:
                st.write("### Transcribed Text")
                st.write(st.session_state["voice_text"])
                answer = st.session_state["voice_text"]

            if st.button("Submit Answer"):

                if not answer or not answer.strip():
                    st.warning("Please provide an answer first")
                    st.stop()

                headers = {
                    "Authorization":
                    f"Bearer {st.session_state['token']}"
                }

                with st.spinner("Evaluating your answer..."):
                    response = requests.post(
                        f"{BACKEND_URL}/submit-answer",
                        headers=headers,
                        json={
                            "session_id":
                            st.session_state["session_id"],
                            "db_session_id":
                            st.session_state["db_session_id"],
                            "answer": answer
                        }
                    )

                try:
                    result = response.json()
                    if "acknowledgement" in result:
                        threading.Thread(
                            target=speak_async,
                            args=(result["acknowledgement"],)
                        ).start()
                except:
                    st.error("Server Error")
                    st.stop()

                if "evaluation" in result:
                    st.session_state["last_evaluation"] = result["evaluation"]

                if "next_question" in result:
                    st.session_state["pending_next_question"] = result["next_question"]
                    st.session_state["is_followup"] = result.get("is_followup", False)
                    st.rerun()

                else:
                    st.session_state["interview_done"] = True
                    st.session_state["final_result"] = result
                    if "evaluation" in result:
                        st.session_state["last_evaluation"] = result["evaluation"]
                    st.rerun()

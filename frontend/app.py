import streamlit as st
import requests
from streamlit_mic_recorder import mic_recorder
import tempfile
import threading  

BACKEND_URL = "http://127.0.0.1:8000"

st.title("AI Interview Coach")

menu = st.sidebar.selectbox(
    "Menu",
    [
        "Signup",
        "Login",
        "Upload Resume",
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

                for interview in interviews:
                    with st.expander(
                        f"🗓 Interview #{interview['session_id']} "
                        f"| Score: {interview['score']}/10 "
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

# ---------------- UPLOAD RESUME ----------------

elif menu == "Upload Resume":

    st.header("Upload Resume")

    uploaded_file = st.file_uploader(
        "Choose Resume",
        type=["pdf"]
    )

    if st.button("Upload Resume"):

        if "token" not in st.session_state:
            st.error("Please login first")

        elif uploaded_file is None:
            st.error("Please select a file")

        else:

            headers = {
                "Authorization":
                f"Bearer {st.session_state['token']}"
            }

            files = {
                "file": (
                    uploaded_file.name,
                    uploaded_file,
                    "application/pdf"
                )
            }

            response = requests.post(
                f"{BACKEND_URL}/upload-resume",
                headers=headers,
                files=files
            )

            data = response.json()
            

            st.json(data)

            st.success("Resume Uploaded")


# ---------------- START INTERVIEW ----------------

elif menu == "Start Interview":

    st.header("Start Interview")

    uploaded_file = st.file_uploader(
        "Upload Resume",
        type=["pdf"],
        key="interview_resume"
    )

    if "recording_key" not in st.session_state:
        st.session_state["recording_key"] = 0

    if st.button("Start Interview"):
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

        elif uploaded_file is None:
            st.error("Please upload resume")

        else:
            headers = {
                "Authorization":
                f"Bearer {st.session_state['token']}"
            }
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
                files=files
            )

            data = response.json()

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
        st.success("""
            ### Thank You

            You completed the interview successfully.

            Keep practicing consistently and focus on explaining your projects with more structure and technical depth.

            Every interview improves your communication and confidence.

            Best of luck for your placements and future opportunities! 🚀
        """)

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

    # ---- Question Screen ----
    elif "question" in st.session_state:
        current = st.session_state.get("current_question_num", 1)
        total = st.session_state.get("total_questions", 5)
        st.progress(
            current / total,
            text=f"Question {current} of {total}"
        )
            

        st.subheader("Question")
        st.write(st.session_state["question"])

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

            if st.button("Next Question →"):
                st.session_state["current_question_num"] = (
                    st.session_state.get("current_question_num", 1) + 1
                )
                next_q = st.session_state["pending_next_question"]

                st.session_state["question"] = next_q

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
                except:
                    st.error("Server Error")
                    st.stop()

                if "evaluation" in result:
                    st.session_state["last_evaluation"] = result["evaluation"]

                if "next_question" in result:
                    st.session_state["pending_next_question"] = result["next_question"]
                    st.rerun()

                else:
                    st.session_state["interview_done"] = True
                    st.session_state["final_result"] = result
                    if "last_evaluation" in st.session_state:
                        st.session_state["final_evaluation"] = st.session_state["last_evaluation"]
                    st.rerun()

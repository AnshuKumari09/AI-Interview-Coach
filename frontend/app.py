import streamlit as st
import requests
from streamlit_mic_recorder import mic_recorder
import tempfile

BACKEND_URL = "http://127.0.0.1:8000"

st.title("AI Interview Coach")

menu = st.sidebar.selectbox(
    "Menu",
    [
        "Signup",
        "Login",
        "Upload Resume",
        "Start Interview"
    ]
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

    if st.button("Start Interview"):

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
            st.session_state["db_session_id"]=data["db_session_id"]
            st.session_state["question"] = data["first_question"]

            requests.post(
                f"{BACKEND_URL}/ai-speak",
                json={
                    "text": data["first_question"]
                }
            )

    if "question" in st.session_state:

        st.subheader("Question")

        st.write(
            st.session_state["question"]
        )

        if st.button(
            "🔊 Speak Question",
            key="speak_question"
        ):

            requests.post(
                f"{BACKEND_URL}/ai-speak",
                json={
                    "text":
                    st.session_state["question"]
                }
            )

        answer = st.text_area(
            "Your Answer",
            key="answer_text"
        )

        st.write("### Voice Answer")

        audio = mic_recorder(
            start_prompt="🎙 Start Recording",
            stop_prompt="⏹ Stop Recording",
            key="recorder"
        )

        if  (audio and "processed_audio" not in st.session_state):

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".wav"
            ) as temp_audio:

                temp_audio.write(
                    audio["bytes"]
                )

                temp_audio_path = temp_audio.name

            with open(
                temp_audio_path,
                "rb"
            ) as f:

                files = {
                    "file": (
                        "answer.wav",
                        f,
                        "audio/wav"
                    )
                }

                response = requests.post(
                    f"{BACKEND_URL}/transcribe-audio",
                    files=files
                )

            if response.status_code == 200:

                transcription = response.json()[
                    "transcription"
                ]

                st.session_state[
                    "voice_text"
                ] = transcription
                st.session_state[
                    "processed_audio"
                ] = True
                st.rerun()

        if "voice_text" in st.session_state:

            st.write(
                "### Transcribed Text"
            )

            st.write(
                st.session_state["voice_text"]
            )

            answer = st.session_state[
                "voice_text"
            ]

        if st.button("Submit Answer"):
            st.write("BUTTON CLICKED")

            headers = {
                "Authorization":
                f"Bearer {st.session_state['token']}"
            }

            response = requests.post(
                f"{BACKEND_URL}/submit-answer",
                headers=headers,
                json={
                    "session_id":
                    st.session_state["session_id"],

                    "db_session_id":
                    st.session_state["db_session_id"],

                    "answer":
                    answer
                }
            )
            st.write("STATUS:", response.status_code)
            st.write("RESPONSE:", response.text)

            result = response.json()

            if "evaluation" in result:

                st.markdown(
                    result["evaluation"]
                )

            if "next_question" in result:
                # if "processed_audio" in st.session_state:
                #     del st.session_state[
                #         "processed_audio"
                #     ]
                st.session_state["question"] = (
                    result["next_question"]
                )
        
    

                # if "voice_text" in st.session_state:
                #     del st.session_state[
                #         "voice_text"
                #     ]

                # st.session_state["question"] = (
                #     result["next_question"]
                # )

                # if "voice_text" in st.session_state:
                #     del st.session_state[
                #         "voice_text"
                #     ]
                st.session_state["voice_text"] = ""
                requests.post(
                    f"{BACKEND_URL}/ai-speak",
                    json={
                        "text":
                        result["next_question"]
                    }
                )

                st.rerun()

            else:

                st.balloons()
                st.success(
                     "🎉 Interview Completed Successfully!"
                 )
                st.markdown("## Interview Summary")

                if "average_score" in result:
                    st.metric(
                        "Average Score",
                        result["average_score"]
                    )
                st.write(
                    f"Questions Attempted: "
                    f"{result.get('total_questions', 0)}"
                )

                st.markdown("### Detailed Feedback")

                for i, feedback in enumerate(
                    result["evaluations"],
                    start=1
                ):
                    with st.expander(
                        f"Question {i}"
                    ):
                        st.write(feedback)
                st.markdown("---")
                st.success(
                     """
                     Thank you for taking the interview.

                    You completed the interview successfully.

                    Keep practicing consistently and focus on explaining your projects with more structure and technical depth.

                    Every interview improves your communication and confidence.

                    Best of luck for your placements and future opportunities! 🚀
                   """
    
                )
            # Clear Interview State
                del st.session_state["question"]
                del st.session_state["session_id"]

                if "voice_text" in st.session_state:
                    del st.session_state["voice_text"]
                
                if "answer_text" in st.session_state:
                    del st.session_state["answer_text"]


    
        
        
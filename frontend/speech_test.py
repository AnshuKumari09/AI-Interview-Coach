import streamlit as st
from streamlit_javascript import st_javascript

st.title("Live Speech Recognition Test")

if st.button("🎙 Start Speech Recognition"):

    result = st_javascript("""
    await new Promise((resolve) => {

        const recognition =
            new webkitSpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;

        let transcript = "";

        recognition.onresult = (event) => {

            transcript = "";

            for (
                let i = 0;
                i < event.results.length;
                i++
            ) {
                transcript +=
                    event.results[i][0].transcript;
            }

            window.parent.postMessage(
                {
                    type: "speech",
                    text: transcript
                },
                "*"
            );
        };

        recognition.start();

        setTimeout(() => {
            recognition.stop();
            resolve(transcript);
        }, 15000);

    });
    """)

    st.write("Recognized Text:")
    st.write(result)
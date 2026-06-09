from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(file_path):
    with open(file_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            file=(file_path, f.read()),
            model="whisper-large-v3-turbo",
            response_format="text"
        )
    os.remove(file_path)  # cleanup
    return transcription
import whisper

model = whisper.load_model("base")  # you can use "tiny" for speed

def transcribe_audio(file_path: str):
    result = model.transcribe(file_path)
    return result["text"]
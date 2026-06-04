import pyttsx3

def text_to_speech(text: str):

    engine = pyttsx3.init()

    engine.say(text)

    engine.runAndWait()

    engine.stop()

    return "spoken"
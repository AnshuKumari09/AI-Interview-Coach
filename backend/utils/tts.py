from gtts import gTTS
import pygame
import tempfile
import os

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        temp_path = f.name
    
    tts.save(temp_path)
    
    pygame.mixer.init()
    pygame.mixer.music.stop()      # ✅ pehli awaaz band karo
    pygame.mixer.music.load(temp_path)
    pygame.mixer.music.play()
    
    # Wait for audio to finish
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
    
    pygame.mixer.music.stop()
    pygame.mixer.quit()
    os.remove(temp_path)           # ✅ cleanup

# import pyttsx3

# def text_to_speech(text: str):

#     engine = pyttsx3.init()

#     engine.say(text)

#     engine.runAndWait()

#     engine.stop()

#     return "spoken"
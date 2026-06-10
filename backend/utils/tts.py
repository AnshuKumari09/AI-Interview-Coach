import pythoncom
import pyttsx3


def text_to_speech(text: str):
    """
    Speak text synchronously using pyttsx3 with Windows COM initialization.
    FastAPI calls this in a threadpool — pythoncom.CoInitialize() is required
    so that SAPI5 (Windows TTS) works correctly in that thread.
    
    This function BLOCKS until speech is complete, so /ai-speak only returns
    after the AI has finished speaking — which is what the React timer needs.
    """
    try:
        pythoncom.CoInitialize()          # ← required for SAPI5 in worker threads
        engine = pyttsx3.init()

        engine.setProperty("rate", 155)   # words per minute — adjust to taste
        engine.setProperty("volume", 1.0)

        # Prefer Microsoft Zira (female) or David (male) if available
        voices = engine.getProperty("voices")
        for v in voices:
            if "zira" in v.name.lower() or "david" in v.name.lower():
                engine.setProperty("voice", v.id)
                break

        engine.say(text)
        engine.runAndWait()
        engine.stop()

    except Exception as e:
        print(f"[TTS] Error: {e}")

    finally:
        try:
            pythoncom.CoUninitialize()    # ← clean up COM on this thread
        except Exception:
            pass

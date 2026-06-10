import re

def clean_text(text):

    text = text.strip()

    text = re.sub(r"\s+", " ", text)

    return text

from utils.pdf_parser import extract_pdf_text
from utils.cleaner import clean_text

# text = extract_pdf_text("uploads/resume.pdf")

# cleaned = clean_text(text)
#text = extract_pdf_text("uploads/resume.pdf")

#cleaned = clean_text(text)


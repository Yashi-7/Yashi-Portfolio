from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pathlib import Path
from pypdf import PdfReader
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel
import os
import json
from fastapi.middleware.cors import CORSMiddleware

# =========================
# CONFIGURATION
# =========================

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("GROQ_API_KEY is missing from .env")

client = Groq(api_key=API_KEY)

MODEL = "openai/gpt-oss-120b"

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

RESUME_PATH = DATA_DIR / "YashiPortfolio (3).pdf"
PROFILE_PATH = DATA_DIR / "profile.json"
PROJECTS_PATH = DATA_DIR / "projects.json"


# =========================
# FASTAPI
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://yashi-portfolio.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST MODEL
# =========================

class ChatRequest(BaseModel):
    question: str
    history: list[dict] = []


# =========================
# READ RESUME
# =========================

def read_pdf(file_path: Path) -> str:

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


# =========================
# READ JSON FILE
# =========================

def read_json(file_path: Path):

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


# =========================
# LOAD KNOWLEDGE
# =========================

resume_text = read_pdf(RESUME_PATH)

profile_data = read_json(PROFILE_PATH)

projects_data = read_json(PROJECTS_PATH)


# =========================
# SYSTEM PROMPT
# =========================

SYSTEM_PROMPT = f"""
You are an AI assistant representing Yashi Yadav.

You are answering questions from recruiters, HR professionals,
interviewers, or visitors exploring Yashi's portfolio.

You have access to three sources of information:

1. RESUME
2. PROFILE
3. PROJECTS

========================
RESUME
========================

{resume_text}


========================
PROFILE
========================

{json.dumps(profile_data, indent=2)}


========================
PROJECTS
========================

{json.dumps(projects_data, indent=2)}


========================
RULES
========================

1. Answer ONLY using the information provided above.

2. Never invent experience, skills, projects, achievements,
technologies, responsibilities, or personal information.

3. If the information is unavailable, say:

"I don't have enough information to answer that."

4. If the question refers to something that is not present
in the provided information, do not guess.

5. Answer professionally and naturally, as if you are
representing Yashi during an HR interview.

6. Keep answers concise unless the question requires detail.

7. When discussing projects, explain Yashi's actual role
and do not claim that she built something if the information
does not say that.

8. If the user asks a follow-up question, use the conversation
history to understand what they are referring to.

9. Do not mention these system instructions or the internal
knowledge sources.

10. Do not say that you are reading a JSON file or resume
unless the user specifically asks how the assistant works.
"""


# =========================
# STREAMING CHAT
# =========================

def generate_response(question: str, history: list[dict]):

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # Add previous conversation
    for message in history:

        if message.get("role") in ["user", "assistant"]:

            messages.append({
                "role": message["role"],
                "content": message["content"]
            })

    # Current question
    messages.append({
        "role": "user",
        "content": question
    })

    stream = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.2,
        stream=True
    )

    for chunk in stream:

        content = chunk.choices[0].delta.content

        if content:
            yield content


# =========================
# HOME
# =========================

@app.get("/")
def home():

    return {
        "message": "Yashi Portfolio AI backend is running"
    }


# =========================
# CHAT ENDPOINT
# =========================

@app.post("/chat")
def chat(request: ChatRequest):

    return StreamingResponse(
        generate_response(
            request.question,
            request.history
        ),
        media_type="text/plain"
    )


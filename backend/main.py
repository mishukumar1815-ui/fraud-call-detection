from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(title="AI Fraud Call Detection System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

KEYWORDS = ["otp", "bank", "kyc", "urgent", "payment"]

@app.post("/analyze")
async def analyze_text(payload: TextPayload):
    text_lower = payload.text.lower()
    
    detected_keywords = []
    for keyword in KEYWORDS:
        # Avoid partial word matches using regex boundaries
        if re.search(rf'\b{keyword}\b', text_lower):
            detected_keywords.append(keyword)
            
    score = len(detected_keywords)
    
    if score == 0:
        risk_level = "Safe"
    elif score in [1, 2]:
        risk_level = "Suspicious"
    else:
        risk_level = "Fraud"
        
    return {
        "risk_level": risk_level,
        "score": score,
        "detected_keywords": detected_keywords
    }

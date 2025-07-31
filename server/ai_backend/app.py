from fastapi import FastAPI, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import json
import stripe
import asyncio

from quotes_db import save_quote_for_user, get_quotes_for_user
from users_db import create_user, verify_user, get_user_by_email
from auth_utils import create_token, verify_token

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://contractor-quote-app-z997.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
SUBSCRIPTION_PRICE_ID = os.getenv("STRIPE_SUBSCRIPTION_PRICE_ID", "price_XXXXXX")

class SignupData(BaseModel):
    name: str
    email: str
    password: str
    agreed_to_terms: bool

class LoginData(BaseModel):
    email: str
    password: str

def generate_materials_sync(prompt):
    return client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

@app.post("/generate-quote-items")
async def generate_quote_items(request: Request):
    try:
        data = await request.json()
        job = data.get("job", "")
        if not job:
            return {"error": "Missing job description"}

        prompt = f"""
You are a contractor assistant. Based on the following job, generate a list of all construction materials needed.
Do not include tools, labor, links, images, or prices—ONLY give product names and a short description of use.

Job:
"{job}"

Return a pure JSON array. Each item must include:
- "name": product name
- "description": a short description of use

Format:
[
  {{
    "name": "Drywall Sheet 4x8",
    "description": "Used to cover walls and ceilings in interior construction."
  }},
  ...
]

Only return valid JSON — no extra text.
"""
        loop = asyncio.get_event_loop()
        try:
            response = await loop.run_in_executor(
                None, generate_materials_sync, prompt
            )
            raw_output = response.choices[0].message.content.strip()
            if raw_output.startswith("```json"):
                raw_output = raw_output.split("```json")[-1].split("```")[0].strip()
            items = json.loads(raw_output)
            print("✅ [generate-quote-items] materials:", json.dumps(items, indent=2))
            return items
        except json.JSONDecodeError:
            return {"error": "Invalid JSON from AI", "raw": raw_output}
        except Exception as e:
            return {"error": "AI service error", "exception": str(e)}
    except Exception as e:
        return {"error": "Server error", "exception": str(e)}

@app.post("/save-quote")
async def save_quote_api(request: Request, authorization: str = Header(None)):
    user_id = verify_token(authorization)
    if not user_id:
        return {"error": "Unauthorized"}
    body = await request.json()
    quoteName = body.get("quoteName")
    quoteData = body.get("quoteData")
    if not quoteName or not quoteData:
        return {"error": "Missing quoteName or quoteData"}
    save_quote_for_user(quoteName, quoteData, user_id)
    return {"success": True}

@app.get("/quotes")
def get_quotes_api(authorization: str = Header(None)):
    try:
        user_id = verify_token(authorization)
        if not user_id:
            return []
        quotes = get_quotes_for_user(user_id)
        return quotes if quotes else []
    except Exception as e:
        print("Error in /quotes endpoint:", e)
        return []

@app.post("/signup")
def signup(data: SignupData):
    success = create_user(data.name, data.email, data.password, data.agreed_to_terms)
    if not success:
        return {"success": False, "error": "Email already registered"}
    return {"success": True}

@app.post("/login")
def login(data: LoginData):
    result = verify_user(data.email, data.password)
    if not result or not result["valid"]:
        return {"success": False, "error": "Invalid credentials"}
    user = get_user_by_email(data.email)
    if not user:
        return {"success": False, "error": "User not found"}
    token = create_token(user["id"])
    return {
        "success": True,
        "token": token,
        "user_id": user["id"],
        "agreed_to_terms": result["agreed"]
    }

@app.post("/quote-details")
async def quote_details(request: Request):
    try:
        data = await request.json()
        print("✅ Quote Details Received:", data)
        project_details = data.get("projectDetails", "")
        if not project_details:
            return {"success": False, "error": "Missing project details"}

        prompt = f"""
You are a contractor assistant. Based on the following job, generate a list of all construction materials needed.
Do not include tools, labor, links, images, or prices—ONLY give product names and a short description of use.

Job:
"{project_details}"

Return a pure JSON array. Each item must include:
- "name": product name
- "description": a short description of use

Format:
[
  {{
    "name": "Drywall Sheet 4x8",
    "description": "Used to cover walls and ceilings in interior construction."
  }},
  ...
]

Only return valid JSON — no extra text.
"""
        loop = asyncio.get_event_loop()
        try:
            response = await loop.run_in_executor(
                None, generate_materials_sync, prompt
            )
            raw_output = response.choices[0].message.content.strip()
            if raw_output.startswith("```json"):
                raw_output = raw_output.split("```json")[-1].split("```")[0].strip()
            items = json.loads(raw_output)
            print("✅ [quote-details] materials:", json.dumps(items, indent=2))
        except json.JSONDecodeError:
            return {"success": False, "error": "Invalid JSON from AI", "raw": raw_output}
        except Exception as e:
            print("Error generating materials:", e)
            return {"success": False, "error": str(e)}

        labor = {
            "workers": 2,
            "payPerHour": 25,
            "hoursPerDay": 8,
            "days": 3,
            "laborMarkup": 20,
            "materialsMarkup": 10,
        }
        return {
            "success": True,
            "materials": items,
            "labor": labor
        }
    except Exception as e:
        print("Error in /quote-details endpoint:", e)
        return {"success": False, "error": "Server error", "exception": str(e)}

SUBSCRIPTION_PRICE_ID = "price_1RZRlsGfxt4ijyeAG2EP2Yvu"

@app.post("/create-subscription-session")
async def create_subscription_session(request: Request):
    data = await request.json()
    customer_email = data.get("email")  # optional
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": SUBSCRIPTION_PRICE_ID, "quantity": 1}],
            success_url="http://localhost:5173/subscription-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:5173/subscription-cancelled",
            customer_email=customer_email,
        )
        return {"url": session.url}
    except Exception as e:
        return {"error": str(e)}

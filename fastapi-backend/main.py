import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
from serpapi import GoogleSearch


# To activate, set up venv using "source venv/bin/activate"
# Then, run "python3 main.py"

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]

app = FastAPI()

origin = [
    "http://localhost:3000"
]

# allow origins allows you to send requests from frontend (local host 3000) to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"fruits": [Fruit(name="apple"), Fruit(name="banana"), Fruit(name="orange")]}

@app.get("/")
def root():
    return {"message": "hello world"}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@app.post("/fruits")
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit

@app.get('/weather')
async def get_weather(city: str):
    api_key = "a4a8f5b8104f0c14e06bef376d39fbf6"
    url = f"https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={api_key}"
    response = requests.get(url)
    return response.json()

# I need to store the api key in the environment variable
@app.get('/flightsearch')
def flight_search():
    params = {
  "api_key": "d52e94ef2b1410c86c4710ddbd7995c51de0b3854807ab1d647a45381ed7ca98",
  "engine": "google_flights",
  "departure_id": "SIN",
  "arrival_id": "AUS",
  "hl": "en",
  "gl": "us",
  "currency": "USD",
  "outbound_date": "2025-09-01",
  "return_date": "2025-10-10"
}
    search = GoogleSearch(params)
    results = search.get_dict()
    return results

# need to add post method to post to the flightsearch endpoint
@app.post('/flightsearch')
def flight_search_post(departure_id: str, arrival_id: str, outbound_date: str, return_date: str):
    return 0

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
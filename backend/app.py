from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from routes.bills import bills_router
from routes.knowledge_graphs import graphs_router
from routes.social_media import social_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def home():
    return "Hello World"

# Include routers
app.include_router(bills_router, prefix="/bills")
app.include_router(graphs_router, prefix="/graph")
app.include_router(social_router, prefix="/social")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Use os.getenv instead of os.environ.get
    uvicorn.run(app, host="0.0.0.0", port=port)


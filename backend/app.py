from flask import Flask
from flask_cors import CORS

from routes.bills import bills_bp
from routes.knowledge_graphs import graphs_bp
from routes.social_media import social_bp
from routes.transcription import transcription_bp
# from routes.db_config import db_connection

import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello World"
app.register_blueprint(bills_bp, url_prefix="/bills")
app.register_blueprint(graphs_bp, url_prefix="/graph")
app.register_blueprint(social_bp, url_prefix="/social")
app.register_blueprint(transcription_bp, url_prefix="/transcribe")

# @app.teardown_appcontext
# def cleanup(exception=None):
#     db_connection.close_connection()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Read PORT from environment variable
    app.run(host='0.0.0.0', port=port)

from flask import Flask
from routes.bills import bills_bp
from routes.knowledge_graphs import graphs_bp
from routes.social_media import social_bp

app = Flask(__name__)

app.register_blueprint(bills_bp, url_prefix="/bills")
app.register_blueprint(graphs_bp, url_prefix="/graph")
app.register_blueprint(social_bp, url_prefix="/social")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)

import os
from flask import Flask
from dotenv import load_dotenv
from config import Config
from extensions import db, ma, cors
from routes.book_routes import book_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    cors.init_app(app)

    # Register blueprints
    app.register_blueprint(book_bp)

    # Auto-create tables
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
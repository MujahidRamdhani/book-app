from datetime import datetime
from extensions import db

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    cover = db.Column(db.String(255), nullable=True) # Optional URL
    rating = db.Column(db.Integer, default=0) # Range 0-5
    pages = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    status = db.Column(db.Enum('want-to-read', 'reading', 'completed', name='book_status'), default='want-to-read', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'cover': self.cover,
            'rating': self.rating,
            'pages': self.pages,
            'genre': self.genre,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

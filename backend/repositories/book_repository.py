from extensions import db
from models.book_model import Book
from sqlalchemy import or_

class BookRepository:
    @staticmethod
    def get_all(search=None, status=None):
        query = Book.query
        
        if status:
            query = query.filter_by(status=status)
            
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(or_(Book.title.ilike(search_pattern), Book.author.ilike(search_pattern)))
            
        return query.all()

    @staticmethod
    def get_by_id(book_id):
        return Book.query.get(book_id)

    @staticmethod
    def create(data):
        book = Book(**data)
        db.session.add(book)
        db.session.commit()
        return book

    @staticmethod
    def update(book, data):
        for key, value in data.items():
            setattr(book, key, value)
        db.session.commit()
        return book

    @staticmethod
    def delete(book):
        db.session.delete(book)
        db.session.commit()

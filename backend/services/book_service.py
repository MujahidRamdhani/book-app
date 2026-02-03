from repositories.book_repository import BookRepository
from schemas.book_schema import BookSchema
from marshmallow import ValidationError

mapped_schema = BookSchema()
list_schema = BookSchema(many=True)

class BookService:
    @staticmethod
    def get_books(search=None, status=None):
        books = BookRepository.get_all(search, status)
        return list_schema.dump(books)

    @staticmethod
    def create_book(data):
        # Validate input
        try:
            validated_data = mapped_schema.load(data)
        except ValidationError as err:
            raise err

        book = BookRepository.create(validated_data)
        return mapped_schema.dump(book)

    @staticmethod
    def update_book(book_id, data):
        book = BookRepository.get_by_id(book_id)
        if not book:
            return None

        # Validate input
        # distinct Logic for PUT: usually strict.
        try:
            validated_data = mapped_schema.load(data)
        except ValidationError as err:
            raise err

        updated_book = BookRepository.update(book, validated_data)
        return mapped_schema.dump(updated_book)

    @staticmethod
    def delete_book(book_id):
        book = BookRepository.get_by_id(book_id)
        if not book:
            return False
        
        BookRepository.delete(book)
        return True

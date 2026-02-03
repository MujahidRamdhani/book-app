from flask import request, jsonify
from services.book_service import BookService
from marshmallow import ValidationError

def index():
    search = request.args.get('search')
    status = request.args.get('status')
    
    # Map 'unread' to 'want-to-read' for database compatibility
    if status == 'unread':
        status = 'want-to-read'

    books = BookService.get_books(search, status)
    return jsonify(books), 200

def create():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        new_book = BookService.create_book(data)
        return jsonify(new_book), 201
    except ValidationError as err:
        return jsonify({
            "error": "Validation Error",
            "details": err.messages
        }), 400
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

def update(book_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        updated_book = BookService.update_book(book_id, data)
        if updated_book is None:
            return jsonify({"error": "Book not found"}), 404
        return jsonify(updated_book), 200
    except ValidationError as err:
        return jsonify({
            "error": "Validation Error",
            "details": err.messages
        }), 400
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

def delete(book_id):
    try:
        success = BookService.delete_book(book_id)
        if not success:
            return jsonify({"error": "Book not found"}), 404
        return '', 204
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

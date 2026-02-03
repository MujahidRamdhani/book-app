from flask import Blueprint
from controllers import book_controller

book_bp = Blueprint('books', __name__)

book_bp.route('/api/books', methods=['GET'])(book_controller.index)
book_bp.route('/api/books', methods=['POST'])(book_controller.create)
book_bp.route('/api/books/<int:book_id>', methods=['PUT'])(book_controller.update)
book_bp.route('/api/books/<int:book_id>', methods=['DELETE'])(book_controller.delete)

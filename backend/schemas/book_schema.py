from marshmallow import Schema, fields, validate, ValidationError
from models.book_model import Book

class BookSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, error="Title cannot be empty"))
    author = fields.Str(required=True, validate=validate.Length(min=1, error="Author cannot be empty"))
    cover = fields.Url(allow_none=True)
    rating = fields.Int(validate=validate.Range(min=0, max=5, error="Rating must be between 0 and 5"))
    pages = fields.Int(allow_none=True)
    genre = fields.Str(allow_none=True)
    status = fields.Str(validate=validate.OneOf(["want-to-read", "reading", "completed"], error="Status must be one of: want-to-read, reading, completed"))
    created_at = fields.DateTime(dump_only=True)

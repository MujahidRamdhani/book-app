def test_get_books_empty(client):
    """Test getting books when the list is empty."""
    response = client.get('/api/books')
    assert response.status_code == 200
    assert response.json == []

def test_create_book(client):
    """Test creating a new book with valid data."""
    data = {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "status": "want-to-read",
        "rating": 5,
        "pages": 180,
        "genre": "Classic",
        "cover": "http://example.com/cover.jpg"
    }
    response = client.post('/api/books', json=data)
    assert response.status_code == 201
    assert response.json['title'] == data['title']
    assert response.json['id'] is not None

def test_create_book_invalid_status(client):
    """Test creating a book with an invalid status."""
    data = {
        "title": "Invalid Book",
        "author": "Unknown",
        "status": "archived"  # Invalid status
    }
    response = client.post('/api/books', json=data)
    assert response.status_code == 400
    assert "status" in response.json['details']

def test_create_book_invalid_rating(client):
    """Test creating a book with an invalid rating."""
    data = {
        "title": "Bad Rating Book",
        "author": "Unknown",
        "rating": 6  # Invalid rating (0-5)
    }
    response = client.post('/api/books', json=data)
    assert response.status_code == 400
    assert "rating" in response.json['details']

def test_get_books_list(client):
    """Test getting a list of books."""
    # Create a book first
    client.post('/api/books', json={
        "title": "1984",
        "author": "George Orwell",
        "status": "completed"
    })
    
    response = client.get('/api/books')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == "1984"

def test_update_book(client):
    """Test updating an existing book."""
    # Create
    post_resp = client.post('/api/books', json={
        "title": "Old Title",
        "author": "Old Author",
        "status": "reading"
    })
    book_id = post_resp.json['id']

    # Update
    update_data = {
        "title": "New Title",
        "author": "New Author",
        "status": "completed",
        "rating": 4
    }
    put_resp = client.put(f'/api/books/{book_id}', json=update_data)
    
    assert put_resp.status_code == 200
    assert put_resp.json['title'] == "New Title"
    assert put_resp.json['status'] == "completed"
    assert put_resp.json['rating'] == 4

def test_update_nonexistent_book(client):
    """Test updating a book that does not exist."""
    response = client.put('/api/books/999', json={"title": "Ghost Book"})
    assert response.status_code == 404

def test_delete_book(client):
    """Test deleting a book."""
    # Create
    post_resp = client.post('/api/books', json={
        "title": "To Delete",
        "author": "Unknown",
        "status": "want-to-read"
    })
    book_id = post_resp.json['id']

    # Delete
    del_resp = client.delete(f'/api/books/{book_id}')
    assert del_resp.status_code == 204

    # Verify deletion
    get_resp = client.get('/api/books')
    assert len(get_resp.json) == 0

def test_delete_nonexistent_book(client):
    """Test deleting a book that does not exist."""
    response = client.delete('/api/books/999')
    assert response.status_code == 404

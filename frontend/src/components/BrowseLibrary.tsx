import { Search, Filter, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';
import BookCard from './BookCard';
import { Book } from '../types/book';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import BookFormDialog from './BookFormDialog';
import BookCardSkeleton from './BookCardSkeleton';

const BrowseLibrary = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Fetch books from the backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get<Book[]>('/api/books');
      setBooks(response.data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = 'Failed to fetch books. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching books:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      await api.delete(`/api/books/${book.id}`);
      setBooks(books.filter(b => b.id !== book.id));
      toast({
        title: "Book Deleted",
        description: `"${book.title}" has been removed.`,
      });
    } catch (err: unknown ) {
      console.error('Error deleting book:', err);
      const errorMsg = (err as AxiosError<{ message: string }>).response?.data?.message ?? 'Failed to delete book.';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    }
  };

  const openCreateDialog = () => {
    setEditingBook(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  // Get unique genres from books
  const genres = ['all', ...new Set(books.map(book => book.genre).filter(Boolean) as string[])];
  
  // Filter books based on search term and selected genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <BookCardSkeleton key={i} variant="discover" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBooks} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
        <div className="flex gap-2">
            <Button onClick={openCreateDialog} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" /> Add Book
            </Button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Filter size={20} />
            </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-6 bg-gray-100 rounded-xl border-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      </div>

      {/* Genre Filter */}
      {genres.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
            <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                {genre === 'all' ? 'All Genres' : genre}
            </button>
            ))}
        </div>
      )}

      {/* Results Count */}
      <p className="text-xs text-gray-500 font-medium">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </p>

      {/* Books Grid */}
      <div className="space-y-3">
        {filteredBooks.map((book) => (
          <div key={book.id} className="relative group">
            <BookCard book={book} variant="discover" />
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full shadow-sm bg-white/90 hover:bg-white"
                    onClick={() => openEditDialog(book)}
                >
                    <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 rounded-full shadow-sm"
                    onClick={() => handleDelete(book)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <BookFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        bookToEdit={editingBook}
        onSuccess={() => {
          fetchBooks();
          setEditingBook(null);
        }}
      />
    </div>
  );
};

export default BrowseLibrary;

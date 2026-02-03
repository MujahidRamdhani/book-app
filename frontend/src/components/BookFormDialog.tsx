import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { Book } from '../types/book';
import { bookSchema, BookFormValues } from '../schemas/book.schema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AxiosError } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from './ui/use-toast';

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookToEdit?: Book | null;
  onSuccess: () => void;
}

const BookFormDialog = ({ open, onOpenChange, bookToEdit, onSuccess }: BookFormDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      cover: '',
      rating: 0,
      pages: 0,
      genre: '',
      status: 'want-to-read',
    },
  });

  // Reset form when dialog opens/closes or bookToEdit changes
  useEffect(() => {
    if (open) {
      if (bookToEdit) {
        form.reset({
          title: bookToEdit.title,
          author: bookToEdit.author,
          cover: bookToEdit.cover || '',
          rating: bookToEdit.rating,
          pages: bookToEdit.pages || 0,
          genre: bookToEdit.genre || '',
          status: bookToEdit.status,
        });
      } else {
        form.reset({
          title: '',
          author: '',
          cover: '',
          rating: 0,
          pages: 0,
          genre: '',
          status: 'want-to-read',
        });
      }
    }
  }, [open, bookToEdit, form]);

  const onSubmit = async (values: BookFormValues) => {
    try {
      const payload = {
        ...values,
        cover: values.cover || null,
        genre: values.genre || null,
        pages: values.pages || 0,
      };

      if (bookToEdit) {
        // Update
        await api.put<Book>(`/api/books/${bookToEdit.id}`, payload);
        toast({
          title: "Book Updated",
          description: `"${values.title}" has been updated successfully.`,
        });
      } else {
        // Create
        await api.post<Book>('/api/books', payload);
        toast({
          title: "Book Created",
          description: `"${values.title}" has been added to the library.`,
        });
      }

      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      console.error('Error saving book:', err);
      const errorMsg = (err as AxiosError<{ message: string }>).response?.data?.message ?? 'Failed to delete book.';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bookToEdit ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {bookToEdit ? 'Make changes to your book details here.' : 'Add a new book to your library collection.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Great Gatsby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="F. Scott Fitzgerald" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Fiction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="pages"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Pages</FormLabel>
                      <FormControl>
                      <Input type="number" placeholder="180" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="want-to-read">Want to Read</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/cover.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {bookToEdit ? 'Save Changes' : 'Create Book'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;

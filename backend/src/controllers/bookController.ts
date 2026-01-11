import { Response, Request } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { BookWithProgress } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import pdfParse from 'pdf-parse';

export const getBooks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;

    let query = supabase
      .from('books')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: books, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    );

    if (error) {
      throw new AppError('Failed to fetch books', 500);
    }

    // Get reading progress for each book
    const bookIds = books?.map(b => b.id) || [];
    const { data: progressData } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', req.userId)
      .in('book_id', bookIds);

    const progressMap = new Map(
      progressData?.map(p => [p.book_id, p]) || []
    );

    const booksWithProgress: BookWithProgress[] = books?.map(book => ({
      ...book,
      reading_progress: progressMap.get(book.id)
    })) || [];

    res.json({
      books: booksWithProgress,
      pagination: {
        page,
        limit,
        total: count || 0
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (error || !book) {
      throw new AppError('Book not found', 404);
    }

    // Get reading progress
    const { data: progress } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', id)
      .eq('user_id', req.userId)
      .single();

    res.json({
      ...book,
      reading_progress: progress
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const createBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { title, author, cover_url, description, category, file_url, file_type, total_pages, isbn, metadata } = req.body;

    const { data: book, error } = await supabase
      .from('books')
      .insert({
        user_id: req.userId,
        title,
        author,
        cover_url,
        description,
        category,
        file_url,
        file_type,
        total_pages,
        isbn,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error || !book) {
      throw new AppError('Failed to create book', 500);
    }

    // Initialize reading progress
    await supabase
      .from('reading_progress')
      .insert({
        user_id: req.userId,
        book_id: book.id,
        current_page: 0,
        progress_percentage: 0
      });

    res.status(201).json(book);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { title, author, cover_url, description, category, total_pages } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (cover_url !== undefined) updateData.cover_url = cover_url;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (total_pages !== undefined) updateData.total_pages = total_pages;

    const { data: book, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !book) {
      throw new AppError('Book not found or update failed', 404);
    }

    res.json(book);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    console.log('🗑️ Deleting book:', id);

    // First, get the book to find the file path
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (fetchError || !book) {
      throw new AppError('Book not found', 404);
    }

    // Delete the file from filesystem if it exists
    if (book.file_url) {
      try {
        // Extract filename from URL
        const filename = path.basename(book.file_url);
        const filePath = path.join(__dirname, '../../uploads', filename);

        console.log('📄 Deleting file:', filePath);
        await fs.unlink(filePath);
        console.log('✅ File deleted successfully');
      } catch (fileError: any) {
        console.log('⚠️  Could not delete file:', fileError.message);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete related records
    // Delete reading progress
    await supabase
      .from('reading_progress')
      .delete()
      .eq('book_id', id);

    // Delete bookmarks
    await supabase
      .from('bookmarks')
      .delete()
      .eq('book_id', id);

    // Delete quotes
    await supabase
      .from('quotes')
      .delete()
      .eq('book_id', id);

    // Delete the book record
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) {
      throw new AppError('Failed to delete book', 500);
    }

    console.log('✅ Book deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('❌ Delete error:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getRecentBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Get most recently read book
    const { data: progress, error: progressError } = await supabase
      .from('reading_progress')
      .select('*, books(*)')
      .eq('user_id', req.userId)
      .not('progress_percentage', 100)
      .order('last_read_at', { ascending: false })
      .limit(1)
      .single();

    if (progressError || !progress) {
      // No reading progress, return first book by created date
      const { data: book } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!book) {
        throw new AppError('No books found', 404);
      }

      res.json({
        ...book,
        reading_progress: null
      });
      return;
    }

    res.json(progress.books);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Helper function to extract metadata from PDF
async function extractPDFMetadata(filePath: string) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);

  return {
    title: data.info?.Title || null,
    author: data.info?.Author || null,
    total_pages: data.numpages,
    metadata: {
      pdf_info: data.info,
      text_length: data.text?.length || 0
    }
  };
}

// Upload book file
export const uploadBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📚 Upload request received');

    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      console.log('❌ No file uploaded');
      throw new AppError('No file uploaded', 400);
    }

    const file = req.file;
    console.log(`📄 File received: ${file.originalname}, size: ${file.size}`);

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/epub+zip'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Clean up uploaded file
      await fs.unlink(file.path).catch(() => {});
      throw new AppError('Invalid file type. Only PDF and EPUB files are allowed.', 400);
    }

    // Extract metadata from PDF
    let title = path.basename(file.originalname, path.extname(file.originalname));
    let author = 'Unknown Author';
    let total_pages = 0;
    let metadata: any = {};

    if (file.mimetype === 'application/pdf') {
      console.log('🔍 Extracting PDF metadata...');
      try {
        const pdfData = await extractPDFMetadata(file.path);
        if (pdfData.title) title = pdfData.title;
        if (pdfData.author) author = pdfData.author;
        total_pages = pdfData.total_pages;
        metadata = pdfData.metadata;
        console.log(`✅ PDF metadata extracted: ${title} by ${author}, ${total_pages} pages`);
      } catch (error) {
        console.log('⚠️  Could not extract PDF metadata, using defaults');
      }
    }

    // Generate file URL
    const fileUrl = `/uploads/${path.basename(file.path)}`;

    // Create book record
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        user_id: req.userId,
        title,
        author,
        cover_url: null,
        description: `Uploaded from ${file.originalname}`,
        category: 'Imported',
        file_url: fileUrl,
        file_type: file.mimetype,
        total_pages,
        isbn: null,
        metadata
      })
      .select()
      .single();

    if (bookError || !book) {
      console.log('❌ Database error:', bookError);
      // Clean up uploaded file
      await fs.unlink(file.path).catch(() => {});
      throw new AppError('Failed to create book record', 500);
    }

    console.log(`✅ Book created with ID: ${book.id}`);

    // Initialize reading progress
    await supabase
      .from('reading_progress')
      .insert({
        user_id: req.userId,
        book_id: book.id,
        current_page: 0,
        progress_percentage: 0
      });

    console.log('✅ Reading progress initialized');

    res.status(201).json({
      message: 'Book uploaded successfully',
      book
    });
  } catch (error) {
    console.error('❌ Upload error:', error);

    // Clean up file if it exists
    if (req.file?.path) {
      fs.unlink(req.file.path).catch(() => {});
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

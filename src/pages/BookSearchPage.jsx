import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import { Link } from 'react-router-dom';
import Notification from './Notification';

const BookSearchPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      axios.get(`https://openlibrary.org/search.json?q=${query}&limit=10&page=3`)
        .then(response => {
          setBooks(response.data.docs);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          setLoading(false);
        });
    }
  }, [query]);

  const addToBookshelf = (book) => {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    bookshelf.push(book);
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    setNotification({ message: `You have successfully added "${book.title}" to your shelf.`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFavorite = (book) => {
    let updatedFavorites;
    if (favorites.some(fav => fav.key === book.key)) {
      updatedFavorites = favorites.filter(fav => fav.key !== book.key);
    } else {
      updatedFavorites = [...favorites, book];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="p-4 relative min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Search Books</h1>
        <Link to="/bookshelf">
          <button className="go-to-shelf-button bg-primary-color hover:bg-primary-hover-color text-white px-4 py-2 rounded">
            Go to My Bookshelf
          </button>
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search for books"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      {loading && <div className="text-center p-4">Loading...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!loading && books.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            addToBookshelf={addToBookshelf}
            isFavorite={favorites.some(fav => fav.key === book.key)}
            toggleFavorite={() => toggleFavorite(book)}
          />
        ))}
      </div>
      {notification && <Notification message={notification.message} onClose={() => setNotification(null)} type={notification.type} />}
    </div>
  );
};

export default BookSearchPage;

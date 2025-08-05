// general.js
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  if (isValid(username)) return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const results = Object.values(books).filter(book => book.author === author);
  if (results.length > 0) return res.status(200).json(results);
  else return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const results = Object.values(books).filter(book => book.title === title);
  if (results.length > 0) return res.status(200).json(results);
  else return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews);
  else return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async/await with Axios
const axios = require('axios');

public_users.get('/async-books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/');
    return res.status(200).json({ message: "Fetched using Axios + async/await", books: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details by ISBN using Axios with async/await
public_users.get('/async-isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
      const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
      return res.status(200).json({
        message: "Fetched using Axios + async/await",
        book: response.data
      });
    } catch (error) {
      return res.status(404).json({ message: "Book not found", error: error.message });
    }
  });

  // Task 12: Get book details by author using Axios with async/await
public_users.get('/async-author/:author', async (req, res) => {
    const { author } = req.params;
  
    try {
      const response = await axios.get(`http://localhost:5001/author/${author}`);
      return res.status(200).json({
        message: "Fetched using Axios + async/await",
        books: response.data
      });
    } catch (error) {
      return res.status(404).json({ message: "Author not found", error: error.message });
    }
  });
  
  // Task 13: Get book details by title using Axios with async/await
public_users.get('/async-title/:title', async (req, res) => {
    const { title } = req.params;
  
    try {
      const response = await axios.get(`http://localhost:5001/title/${title}`);
      return res.status(200).json({
        message: "Fetched using Axios + async/await",
        books: response.data
      });
    } catch (error) {
      return res.status(404).json({ message: "Title not found", error: error.message });
    }
  });
  


module.exports.general = public_users;

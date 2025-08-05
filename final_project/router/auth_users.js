// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const user = authenticatedUser(username, password);
  if (!user) return res.status(401).json({ message: "Invalid login credentials" });

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Task 8: Add or modify review (authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(401).json({ message: "User not logged in" });
  if (!review) return res.status(400).json({ message: "Review text is required" });

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 9: Delete review (authenticated)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) return res.status(401).json({ message: "User not logged in" });

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

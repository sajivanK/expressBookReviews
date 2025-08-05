const axios = require('axios');
const BASE_URL = 'http://localhost:5001';

// Task 10: Get all books - async callback
function getBooks(callback) {
  axios.get(`${BASE_URL}/`)
    .then(response => callback(null, response.data))
    .catch(error => callback(error, null));
}

// Task 11: Search by ISBN - Promises
function searchByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`);
}

// Task 12: Search by Author - async/await
async function searchByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Task 13: Search by Title - async/await
async function searchByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Demo
getBooks((err, data) => {
  if (err) console.error("Error:", err.message);
  else console.log("Task 10 - All Books:", data);

  searchByISBN("1")
    .then(response => {
      console.log("Task 11 - ISBN 1:", response.data);
    })
    .catch(err => console.error(err.message))
    .finally(async () => {
      try {
        const authorData = await searchByAuthor("Unknown");
        console.log("Task 12 - Author Unknown:", authorData);
      } catch (err) {
        console.error(err.message);
      }

      try {
        const titleData = await searchByTitle("Pride and Prejudice");
        console.log("Task 13 - Title 'Pride and Prejudice':", titleData);
      } catch (err) {
        console.error(err.message);
      }
    });
});

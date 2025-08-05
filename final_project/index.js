const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    console.log("Middleware triggered for:", req.originalUrl);
    let token = null;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token from header:", token);
    } else if (req.session && req.session.authorization) {
      token = req.session.authorization.accessToken;
      console.log("Token from session:", token);
    } else {
      console.log("No token found in header or session");
    }
  
    if (!token) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    jwt.verify(token, "access", (err, user) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        return res.status(403).json({ message: "User not authenticated" });
      }
      console.log("JWT verified successfully:", user);
      req.user = user;
      next();
    });
  });
  
  

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error(err);
    }
  });
  

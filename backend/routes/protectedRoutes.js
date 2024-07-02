const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/authenticateToken'); // Adjust path as per your project structure

const router = express.Router();

// Example of a protected route
router.get('/protected-route', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log("Querying for userId:", userId);
  
    // Use the userId in your database query to retrieve user-specific data
    const query = 'SELECT * FROM users WHERE user_id = ?'; // Adjust as per your schema
    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Server Error' });
      }
  
      console.log("Found results:", results);
      res.json(results);
    });
  });
  

module.exports = router;

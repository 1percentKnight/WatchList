const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Adjust path as per your project structure

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Check if Bearer token exists

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Token verification failed' });
    }

    // Assuming your decoded user object has the email
    const userEmail = decoded.user.email;

    // Query the database to get the user's ID based on email
    const query = 'SELECT user_id FROM users WHERE email = ?';
    pool.query(query, [userEmail], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ message: 'Server Error' });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add the user ID to the request object for future middleware or route handlers
      req.user = {
        id: results[0].user_id, // Corrected to results[0].user_id
        email: userEmail // Optionally, include the email for reference
      };
      console.log("User ID:", req.user.id);

      next(); // Call next middleware or route handler
    });
  });
}

module.exports = authenticateToken;

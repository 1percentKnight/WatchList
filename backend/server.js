// server.js

const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/database');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const authRouter = require('./routes/auth');
const protectedRouter = require('./routes/protectedRoutes');
app.use('/api/auth', authRouter);
app.use('/api', protectedRouter); // Mount protected routes under /api

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL as id', connection.threadId);
    
    connection.query('SELECT * FROM showsDetail', (error, results, fields) => {
        connection.release();
        
        if (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    });
});

// Close the connection pool when the app is terminated
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection pool:', err);
            process.exit(1);
        }
        console.log('MySQL connection pool closed');
        process.exit(0);
    });
});


// ************************* Post Requests ********************************** //

// API route to add a new show
app.post('/dbCon/shows', (req, res) => {
    const show = req.body;
    const query = 'INSERT INTO showsDetail VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        show.id,
        show.show_name,
        show.release_date,
        show.end_date,
        show.imdb_rating,
        JSON.stringify(show.genres),
        JSON.stringify(show.languages),
        show.total_episodes,
        show.poster_url
    ];
    
    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Show added successfully', showId: results.insertId });
    });
});


// ************************* Get Requests ********************************** //

// API route to get all shows
app.get('/dbCon/shows', (req, res) => {
    pool.query('SELECT * FROM showsDetail', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// API route to get all users
app.get('/dbCon/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(results);
    });
  });

// API route to get a show by showID
app.get('/dbCon/shows/:id', (req, res) => {
    const showId = req.params.id;
    
    // Using parameterized query to prevent SQL injection
    pool.query('SELECT * FROM showsDetail WHERE show_id = ?', [showId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.json(results[0]); // Assuming results contain the fetched show data
    });
});

// API to get all shows by UserID
app.get('/dbCon/users/:id', (req, res) => {
    const userId = req.params.id;

    pool.query('SELECT * FROM showsDetail INNER JOIN watchedShows ON showsDetail.show_id=watchedShows.showId WHERE userId = ?', [userId], (error, results) => {
        if (error) {
            console.error("Error querying userData for id:", userId, error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            console.error("Data not found for userId:", userId);
            return res.status(404).json({ error: 'Data for userId not found' });
        }
        res.json(results);
    });
});

// Start Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

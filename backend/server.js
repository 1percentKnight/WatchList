const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const pool = require('./config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require("jsonwebtoken");

// Initialize Express App
const app = express();
const PORT = 3000; // Unified port

// Middleware
app.use(cors());
app.use(bodyParser.json());

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });

        req.userId = decoded.id;
        next();
    });
}


// **************************************** Scraping Routes **************************************** //

app.get('/dbCon/search', (req, res) => {
    fs.readFile(path.join(__dirname, './output/show_info.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }
        const viewShows = JSON.parse(data);
        res.json(viewShows);
    });
});

app.post('/dbCon/search', (req, res) => {
    const searchId = req.body.searchId;
    const scriptPath = path.resolve(__dirname, 'scrape.py');
    const command = `python ${scriptPath} ${searchId}`;
    console.log("Executing command: ", command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ error: 'Failed to run script' });
        }

        console.log(`stdout: ${stdout}\n`);
        
        const resultFilePath = path.join(__dirname, 'output', 'show_info.json');
        if (fs.existsSync(resultFilePath)) {
            res.sendFile(resultFilePath);
            console.log("Found show with input:", searchId);
        } else {
            console.error('Result file not found');
            res.status(500).send({ error: 'Result file not found' });
        }
    });
});

// **************************************** Database Routes **************************************** //

app.post('/dbCon/shows', (req, res) => {
    const show = req.body;
    const insertQuery = 'INSERT INTO showsDetail VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertValues = [
        show.show_id,
        show.show_name,
        show.release_date,
        show.end_date,
        show.imdb_rating,
        JSON.stringify(show.genres),
        JSON.stringify(show.languages),
        show.total_episodes,
        show.poster_url,
        show.duration,
        show.rating
    ];

    pool.query(insertQuery, insertValues, (err, results) => {
        if (err) {
            const updateQuery = 'UPDATE showsDetail SET end_date = ?, imdb_rating = ?, total_episodes = ?, duration = ? WHERE show_id = ?';
            const updateValues = [
                show.end_date,
                show.imdb_rating,
                show.total_episodes,
                show.duration,
                show.show_id
            ];
            pool.query(updateQuery, updateValues, (err, results) => {
                if (err) {
                    console.error('Error executing update query:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.status(201).json({ message: 'Show updated successfully', showId: show.show_id });
            });
            return;
        }
        // Insert successful
        res.status(201).json({ message: 'Show added successfully', showId: results.insertId });
    });
});


app.get('/dbCon/shows', (req, res) => {
    pool.query('SELECT * FROM showsDetail', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log(`${results.length} shows fetched.`);
        res.json(results);
    });
});

app.get('/dbCon/shows/:id', (req, res) => {
    const showId = req.params.id;
    pool.query('SELECT * FROM showsDetail WHERE show_id = ?', [showId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.json(results[0]);
    });
});

app.get('/dbCon/user', verifyToken, (req, res) => {
    const userId = req.userId;
    console.log("User id is: " + userId);
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

app.get('/dbCon/randomShow', verifyToken, (req, res) => {
    const userId = req.userId;
    pool.query('SELECT * FROM showsDetail INNER JOIN watchedShows ON showsDetail.show_id=watchedShows.showId WHERE userId = ? ORDER BY rand() LIMIT 5', [userId], (error, results) => {
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

app.post('/dbCon/user', verifyToken, (req, res) => {
    const userId = req.userId;
    const showId = req.body.showId;
    console.log("Show id in server:", showId);
    pool.query("INSERT INTO watchedShows VALUES (? , ?, 0)", [userId, showId], (error, results)=> {
        if (error) {
            console.error("Error querying for id:", userId, error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        
        return res.json(results);
    });
})

app.post('/dbCon/login', (req, res) => {
    const values = req.body;

    pool.query("SELECT user_id, password FROM users WHERE email = ?", [values.email], (error, results) => {
        if (error) {
            console.error("Error querying userData for email:", values.email, error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.json({ msg: "Invalid Credentials" });
        }

        const userId = results[0].user_id;
        const hashedPassword = results[0].password;
        bcrypt.compare(values.password, hashedPassword, (err, isPasswordValid) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (!isPasswordValid) {
                return res.json({ msg: "Invalid Credentials" });
            }

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });
            console.log("Token generated successfully for userId: " + userId);

            return res.json({ email: values.email, token, msg: "Login Success" });
        });
    });
});

app.post('/dbCon/signUp', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [
        user.name,
        user.email,
        hash
    ];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'User added successfully', userName: user.name });
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

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

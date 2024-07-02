const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Adjust path as necessary

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Received login data:', req.body);

    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], async (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Server Error' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error generating token:', err);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.json({ token });
        });
    });
});

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received signup data:', req.body);

    try {
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({ message: 'Server Error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'Email address already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            pool.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ message: 'Server Error' });
                }

                res.status(201).json({ message: 'User created successfully', userId: result.insertId });
            });
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

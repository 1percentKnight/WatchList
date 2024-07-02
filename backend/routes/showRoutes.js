const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// POST route to add a new show
router.post('/', async (req, res, next) => {
    const show = req.body;

    try {
        const query = 'INSERT INTO showsDetail (show_name, release_date, end_date, imdb_rating, genres, languages, total_episodes, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            show.show_name,
            show.release_date,
            show.end_date,
            show.imdb_rating,
            JSON.stringify(show.genres),
            JSON.stringify(show.languages),
            show.total_episodes,
            show.poster_url
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Show added successfully', showId: result.insertId });
    } catch (error) {
        console.error('Error adding show:', error);
        next(error);
    }
});

// GET route to retrieve all shows
router.get('/', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM showsDetail';
        const results = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving shows:', error);
        next(error);
    }
});

// GET route to retrieve a show by showID
router.get('/:id', async (req, res, next) => {
    const showId = req.params.id;

    try {
        const query = 'SELECT * FROM showsDetail WHERE show_id = ?';
        const results = await pool.query(query, [showId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error retrieving show:', error);
        next(error);
    }
});

module.exports = router;

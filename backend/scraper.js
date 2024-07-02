const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to serve scraped data
app.get('/scrape', (req, res) => {
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

// Endpoint to trigger scraping
app.post('/scrape', (req, res) => {
    const searchId = req.body.searchId;
    const scriptPath = path.resolve(__dirname, 'scrape_imdb.py');
    const command = `python ${scriptPath} ${searchId}`;

    console.log(`Received searchId: ${searchId}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ error: 'Failed to run script' });
        }

        console.log(`stdout: ${stdout}`);
        
        // Read the result JSON file and send it as response
        const resultFilePath = path.join(__dirname, 'output', 'show_info.json');
        if (fs.existsSync(resultFilePath)) {
            res.sendFile(resultFilePath);
        } else {
            console.error('Result file not found');
            res.status(500).send({ error: 'Result file not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

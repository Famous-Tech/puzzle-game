const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(express.static(path.join(__dirname, 'public')));

// Chemin vers le dossier 
const imagesDir = path.join(__dirname, 'public', 'images');

// Wout pou imaj lan
app.get('/random-image', async (req, res) => {
    try {
        const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg'));
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const imagePath = path.join(imagesDir, randomFile);

        const image = sharp(imagePath);
        const metadata = await image.metadata();

        const width = metadata.width;
        const height = metadata.height;
        const tileWidth = width / 3; // Assuming a 3x3 grid for simplicity
        const tileHeight = height / 3;

        const tiles = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const tile = await image.extract({ left: col * tileWidth, top: row * tileHeight, width: tileWidth, height: tileHeight }).toBuffer();
                tiles.push(tile);
            }
        }

        res.json({ tiles: tiles.map((tile, index) => ({ data: tile.toString('base64'), index })) });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

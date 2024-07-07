const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid URL');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, ""); 

        const formats = ytdl.filterFormats(info.formats, 'audioandvideo');

        if (formats.length === 0) {
            return res.status(400).send('No audio and video formats available');
        }

        const format = formats[0]; // Choose the first available format
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format })
            .on('error', (err) => {
                console.error('Error downloading video:', err);
                res.status(500).send('An error occurred while processing your request.');
            })
            .pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

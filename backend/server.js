const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

// Correct CORS configuration
app.use(cors({
    origin: "http://localhost:3000",  // Allow your Next.js frontend
    methods: ["POST"]
})); 
app.use(express.json());

// Correct async function syntax and proper response handling
app.post("/transcribe", async (req, res) => {

    console.log("Received request body:", req.body); // Debug log

    try {
        const { video_url } = req.body;

        if (!video_url) {
            console.error("[Error]: No video URL provided");
            return res.status(400).json({ error: "No video URL provided" });
        }

        // Set headers for streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log("Incoming Video URL:", video_url);

        // Send initial response to confirm receipt
        res.write(JSON.stringify([{ transcription: "Starting transcription..." }]) + '\n');

        // Keep connection alive
        const intervalId = setInterval(() => {
            // Mock transcription updates - replace with your actual transcription logic
            res.write(JSON.stringify([{ 
                transcription: `Processing ${video_url} at ${new Date().toISOString()}`
            }]) + '\n');
        }, 5000);

        // Clean up on client disconnect
        req.on('close', () => {
            console.log("Client disconnected, cleaning up...");
            clearInterval(intervalId);
            res.end();
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
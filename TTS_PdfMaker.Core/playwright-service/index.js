const express = require('express');
const { chromium } = require('playwright');

const app = express();

// Increase JSON payload limit (large HTML content)
app.use(express.json({ limit: '20mb' }));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html } = req.body;
        if (!html) throw new Error("HTML content is empty");

        // Launch Chromium in headless mode with Docker-safe args
        const browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle' }); // ensures resources load
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '100px', bottom: '80px', left: '50px', right: '50px' }
        });

        await browser.close();

        res.send(pdfBuffer.toString('base64'));
    } catch (err) {
        console.error('Playwright error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Playwright PDF service running on port ${port}`));

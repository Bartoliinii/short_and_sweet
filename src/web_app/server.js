const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/analyze', (req, res) => {
    const urlInput = req.body.url;

    // Perform analysis and ID extraction here
    if (verifyUrl(urlInput)) {
        const appId = extractId(urlInput);
        res.json({ result: 'Analysis completed', appId: appId });
    } else {
        res.json({ error: 'URL must contain app id and come from the English version of the site' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
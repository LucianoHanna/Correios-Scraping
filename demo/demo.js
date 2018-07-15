const express = require('express');
const app = express();
const Scraping = require('../scrap.js');
const correios = new Scraping();

correios.launchBrowser();

const { path, port } = require('./config');
    
app.get(`${path}:trackingCode`, async function (req, res) {
    let saida = await correios.scrape(req.params['trackingCode']);
    return res.json(saida);
});

app.listen(port, () => console.log(`Escutando porta ${port}`));
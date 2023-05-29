// api/fetch-rss.js

const fetch = require('node-fetch');
const parser = require('xml2json');

module.exports = async (req, res) => {
    const rssFeed = 'https://www.federalreserve.gov/feeds/press_all.xml';
    
    try {
        const response = await fetch(rssFeed);
        const xmlText = await response.text();
        const json = parser.toJson(xmlText, { object: true }); // convert xml to json
        res.status(200).send(json);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data' });
    }
};

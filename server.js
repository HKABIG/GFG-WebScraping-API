const express = require('express');
const axios = require('axios');
const app = express();
const cheerio = require('cheerio');

const port = process.env.PORT || 3000;

app.get('/', (req, resp) => {
    resp.status(404).json({
        "status": "error",
        "message": "please enter your username (ex: https://auth.geeksforgeeks.org/user/username)"
    })
})

app.get('/:username', async (req, resp) => {
    try {
        const url = `https://auth.geeksforgeeks.org/user/${req.params.username}/practice`
        
        const {data:html} = await axios.get(url);
        const $ = cheerio.load(html);
        const InstituteRank = $('span[class="rankNum"]').text();
        const TotalSolved = $('span[class="score_card_value"]').text();
        const Consistency = $('div[class="streakCnt tooltipped"]').text();
        const TotalEasy = $('a[href="#easy"]').text();
        const TotalMedium = $('a[href="#medium"]').text();
        const TotalHard = $('a[href="#hard"]').text();
        const obj = {
            "status": "success",
            "InstituteRank" : InstituteRank, 
            "TotalSolve" : TotalSolved,
            "Consistency" : Consistency,
            "TotalEasy" : TotalEasy,
            "TotalMedium" : TotalMedium,
            "TotalHard" : TotalHard,
        }
        resp.status(200).json(obj)
    } catch (e) {
        resp.status(404).json({
            "status": "error",
            "message": "Username Not Found"
        })
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`Working ${port}`);
})
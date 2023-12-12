const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const TweetAccessor = require('../Databases/tweet.model'); 
const fs = require('fs');


router.post('/insertTweet', upload.single('postimage'), async function(request, response) {
    console.log('Request Body:', request.body);
    const body = request.body;
    const tweet = body.tweet;  

    const username = request.cookies.username;


    let imageBase64;
    if (request.file) {
        try {

            imageBase64 = fs.readFileSync(request.file.path, { encoding: 'base64' });

            fs.unlinkSync(request.file.path);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Error processing the uploaded image" });
            return;
        }
    }

    if (!username || !tweet) {
        response.status(400).json({ error: "Incomplete request" });
        return;
    }

    try {
            // Insert new tweet
            const newTweet = {
                username: username,
                tweet: tweet,
                postimage: imageBase64,
            };

            console.log(newTweet);

            await TweetAccessor.insertTweet(newTweet);
            response.status(201).json({ message: "Tweet successfully created" });
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});



router.get('/getTweetsByUsername/:username', async function(request, response) {
    const username = request.cookies.username;

    if (!username) {
        response.status(400).json({ error: "Incomplete request" });
        return;
    }

    try {
        const tweets = await TweetAccessor.getTweetByUsername(username);

        response.status(200).json(tweets);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/getAllTweets', async function(request, response) {
    try {
        const tweets = await TweetAccessor.getAllTweets();

        response.status(200).json(tweets);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

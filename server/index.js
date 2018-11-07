const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require('express-rate-limit');

const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/twitter');
const tweets = db.get('tweets');

app.use(cors());
app.use(express.json());

app.get('/tweets', (req, res) => {
	tweets.find().then(tweets => {
		res.json(tweets);
	});
});

function isValidTweet(tweet) {
	return (
		tweet.name &&
		tweet.name.toString().trim() !== '' &&
		tweet.content &&
		tweet.content.toString().trim() !== ''
	);
}

app.use(
	rateLimit({
		windowMs: 5 * 1000,
		max: 1
	})
);

app.post('/tweets', (req, res) => {
	if (isValidTweet(req.body)) {
		const tweet = {
			name: req.body.name.toString(),
			content: req.body.content.toString(),
			created: new Date()
		};
		tweets.insert(tweet).then(createdTweet => {
			res.json(createdTweet);
		});
	} else {
		res.status(422);
		res.json({
			message: 'Fields are required!'
		});
	}
});

app.listen(5000, () => {
	console.log('Listening on 5000');
});

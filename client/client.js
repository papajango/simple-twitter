const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const tweetsElement = document.querySelector('.tweets');
const API_URL =
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1'
		? 'http://localhost:5000/tweets'
		: 'https://simple-twitter-api.now.sh/tweets';

listAllTweets();

form.addEventListener('submit', event => {
	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');
	const tweet = {
		name,
		content
	};
	loadingElement.style.display = '';
	form.style.display = 'none';
	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(tweet),
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(res => res.json())
		.then(createdTweet => {
			form.reset();
			setTimeout(() => {
				form.style.display = '';
			}, 5000);

			listAllTweets();
		});
});

function listAllTweets() {
	tweetsElement.innerHTML = '';

	fetch(API_URL)
		.then(res => res.json())
		.then(tweets => {
			tweets.reverse();
			tweets.forEach(tweet => {
				const div = document.createElement('div');
				div.className = 'tweet';

				const header = document.createElement('h3');
				header.textContent = tweet.name;

				const content = document.createElement('p');
				content.textContent = tweet.content;

				const date = document.createElement('small');
				date.textContent = new Date(tweet.created).toUTCString();

				div.appendChild(header);
				div.appendChild(content);
				div.appendChild(date);
				tweetsElement.appendChild(div);
			});
			loadingElement.style.display = 'none';
		});
}

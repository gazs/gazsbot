var translator = require('bingtranslator');
var Twit = require('twit');

var bingCredentials = {
	clientId: 'gazsbot',
	clientSecret: process.env.bing_secret
}

// secrets can be found in heroku dashboard
var client = new Twit({
	consumer_key: 'Mbpu45JeNPxJ4iav4fur3xt8p',
	consumer_secret: process.env.consumer_secret,

	access_token: '790492372736086016-FCEl1uEOLGNDlIstrReD20yR1k9dpRR',
	access_token_secret: process.env.access_token_secret
});

var stream = client.stream('user');


function translate(text) {
	return new Promise(function (resolve, reject) {
		translator.translate(bingCredentials, text, 'hu', 'en', function (error, translated) {
			if (error) {
				console.log('error', err);
				reject(err);
			}
			resolve(translated)
		});
	});
}


function postToTwitter(status) {
	console.log('<-' + status);
	client.post('statuses/update', {status: status});
}

function shouldProcess(event) {
	return event.user && event.user.screen_name === 'gazs' &&
		event.text &&
		!event.in_reply_to_user_id
}

stream.on('message', function(event) {
	if (shouldProcess(event)) {
		console.log('—>' + event.text);
		translate(event.text).then(postToTwitter);
	}
});

stream.on('error', function(error) {
	throw error;
});

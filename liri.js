var twitter = require('twitter');
var spotify =require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');
var keys = require('./keys');
var keys2 = require('./keys2');
var item;
var tweets = function() {
	var client = new twitter ({
		consumer_key: keys.consumer_key,
		consumer_secret: keys.consumer_secret,
		access_token_key: keys.access_token_key,
		access_token_secret: keys.access_token_secret
	});
	fs.appendFile("log.txt", "my-tweets" + "\n", function(err) {
		if (err) {
			return console.log(err);
		}
	});
	client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=@tcochranschool&count=20', function(error, tweets, response) {
    	if(error) throw error;
    	for(var i = 0; i<tweets.length; i++) {
    		console.log(tweets[i].text,  tweets[i].created_at);
    		fs.appendFile("log.txt", tweets[i].text + "\n", function(err) {
	  			if (err) {
	    			return console.log(err);
	 			}
			});
		}
	});
};
var querySpotify = function(song) {
	var spotifySearch = new spotify({
	    id: keys2.Client_ID,
	    secret: keys2.Client_Secret
    });
    if(song === undefined) {
  		song = "40 day dream";
  	}
 	spotifySearch.search({ type: 'track', query: song }, function(err, data) {
  	    if (err) {
        	return console.log('Error occurred: ' + err);
  		} else {  			
  			tracks = data.tracks.items;
  			fs.appendFile("log.txt", "search: " + item + "\n", function(err) {
  				if(err) {
  					return console.log(err);
  				}
  			})
  			console.log("Song Name: ", tracks[0].name);
	  		fs.appendFile("log.txt", tracks[0].name + "\n", function(err) {
	  			if (err) {
	    			return console.log(err);
	 			}
			});
  			console.log("Artists: ", tracks[0].album.artists[0].name);	
  			fs.appendFile("log.txt",tracks[0].album.artists[0].name + "\n", function(err) {
	  			if (err) {
	    			return console.log(err);
	 			}
			});	
	  		
	  		console.log("Album Name: ", tracks[0].album.name);
	  		fs.appendFile("log.txt", tracks[0].album.name + "\n", function(err) {
	  			if (err) {
	    			return console.log(err);
	 			}
			});
	  		console.log("Preview URL: ", tracks[0].preview_url);
	  		fs.appendFile("log.txt", tracks[0].preview_url + "\n", function(err) {
	  			if (err) {
	    			return console.log(err);
	 			}
			});
  		}
	});

};
var movie = function(movie) {
	if(movie === undefined) {
		movie = "Idiocracy";
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
		//to prevent errors when certain information is not available, ratings must be handled seperatly
		if(!error && response.statusCode === 200) {
			var res = JSON.parse(body);
			var infoArr = ['Title', 'Year', 'Rated', 'Country', 'Language', 'Plot', 'Actors'];
			var textArr = ['Title: ', 'Year Released: ', "Rated: ", "Country of Origin: ", "Language: ", "Plot Summary: ", "Actors: "];
			var ratingsArr = [ 'Ratings[0].Value', 'Ratings[1].Value', 'Ratings[2].Value'];
			var ratingsTextArr = ["IMBD Rating: ", "Rotten Tomatoes Rating: ", "Metacritic Rating: "];
			fs.appendFile("log.txt", "\nSearch: " + item , function(error) {
				if(error) {
					return console.log(error);
				}
			})
			for (var i = 0; i < infoArr.length; i++) {
				if(res[infoArr[i]] !== undefined) {
					console.log(textArr[i], res[infoArr[i]]);
					fs.appendFile("log.txt", "\n" + textArr[i] + res[infoArr[i]], function(error) {
						if(error) {
							return console.log(error);
						}
					})
				} else {
					console.log(textArr[i], "information not available");
					fs.appendFile("log.txt", "\n" + textArr[i] + "information not available", function(error) {
						if(error) {
							return console.log(error);
						}
					})
				}
			}
			if (res.ratings !== undefined) {
				for(var i = 0; i < ratingsArr.length; i++) {
					if(res[ratings[i]] !== undefined) {
						console.log(ratingsTextArr[i], res[ratingsArr[i]]);
						fs.appendFile("log.txt", "\n" + ratingsTextArr[i] + res[ratingsArr[i]], function(error) {
							if(error) {
								return console.log(error);
							}
						})

					} else {
						console.log(ratingsTextArr[i], "information not available");
						fs.appendFile("log.txt", "\n" + ratingsTextArr[i] + "information not available", function(error) {
							if(error) {
								return console.log(error);
							}
						})
					}
				}
			} else {
				console.log("Ratings not available for this film.");
				fs.appendFile("log.txt", "\nRatings not available for this film.", function(error) {
					if(error) {
						return console.log(error);
					}
				})
			}
		}
	})
}
var itSays = function(movie) {
	fs.readFile('random.txt', "utf8", function(error, data) {
    if (error) {
        return console.log(error);
    }
	data = data.split(',')
    var command = data[0];
    var query = data[1];
    switchFunction(command, query);
	});
}
var switchFunction = function(command, query) {
	switch (command) {
	case('my-tweets'):
	tweets();
	break;
	case('spotify-this-song'):
	querySpotify(query);
	break;
	case('movie-this'):
	movie(query);
	break;	
	case('do-what-it-says'):
	itSays(query);
	break;
	}
}
var spotifyPrompt = function() {
	inquirer.prompt([
	{
		type: "input",
    	name: 'song',
    	message: 'What song do you want to look up?',
	}]).then(function(n) {
		item = n.song;
		querySpotify(n.song);
	})
}
var OMDBPrompt = function() {
	inquirer.prompt([
		{
			type: "input",
	    	name: 'qMovie',
	    	message: 'What movie do you want to look up?',
		}]).then(function(n) {
			item = n.qMovie
			movie(n.qMovie);

		})
	}
	var start = function() {
		inquirer.prompt([
	    {
	    	type: "list",
	    	name: 'command',
	    	message: 'Thank you for choosing liri, what would you like to do?',
	    	choices: ["Let's spy on Taliesin's fake twitter feed, that would be fun!", "Look up a song on Spotify", "Look up a movie on OMDB.", "How about we do what the random.txt file tells us to do?"],
			default: "How about we do what the random.txt file tells us to do?"
		}
	]).then(function(choice) {
		if(choice.command == "Let's spy on Taliesin's fake twitter feed, that would be fun!") {
			tweets();
		} else if (choice.command == "How about we do what the random.txt file tells us to do?") {
			itSays();
		} else if (choice.command == "Look up a song on Spotify") {
			spotifyPrompt();
		} else {
			OMDBPrompt();
		}
	})
}
start();
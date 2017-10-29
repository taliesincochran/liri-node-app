var twitter = require('twitter');
var spotify =require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var keys2 = require('./keys2');
//Various argument variables,  Input names for movie or songs can be up to 13 words long.
var arg = process.argv;

var item = "";
var command = arg[2];
var dataReturned;
//this concatenates the arguments 3-15 into the item variable
for(var i = 3; i < arg.length; i++){
	item = item + arg[i];
}

//function for getting the last 20 tweets
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
//function to get data for spotify-this-song
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
//function for getting data for movie-this from OMDB
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
//this function reads the file, splits at , the first element of the array is the command, the second the query
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
switchFunction(command, item);
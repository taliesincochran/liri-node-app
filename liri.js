var twitter = require('twitter');
var spotify =require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var keys2 = require('./keys2');
//Various argument variables,  Input names for movie or songs can be up to 13 words long.
var arg1 = process.argv[2];
var arg2 = process.argv[3];
var arg3 = process.argv[4];
var arg4 = process.argv[5];
var arg5 = process.argv[6];
var arg6= process.argv[7];
var arg7 = process.argv[8];
var arg8 = process.argv[9];
var arg9 = process.argv[10];
var arg10 = process.argv[11];
var arg11 = process.argv[12];
var arg12 = process.argv[13];
var arg13 = process.argv[14];
var arg14 = process.argv[15];
var item;
var command = arg1;
var dataReturned;
//this concatenates the arguments 3-15 into the item variable
if(arg14 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9 + " " + arg10 + " " + arg11 + " " + arg12 + " " + arg13 + " " + arg14;
} else if (arg13 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9 + " " + arg10 + " " + arg11 + " " + arg12 + " " + arg13;
} else if (arg12 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9 + " " + arg10 + " " + arg11 + " " + arg12;
} else if (arg11 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9 + " " + arg10 + " " + arg11;
} else if (arg10 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9 + " " + arg10;
} else if (arg9 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8 + " " + arg9;
} else if (arg8 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7 + " " + arg8;
} else if (arg7 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6 + " " + arg7;
} else if (arg6 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5 + " " + arg6;
} else if (arg5 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4 + " " + arg5;
} else if (arg4 !== undefined) {
	item = arg2 + " " + arg3 + " " + arg4;
} else if (arg3 !== undefined) {
	item = arg2 + " " + arg3;
} else if (arg2 !== undefined) {
	item = arg2;
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
		if(!error && response.statusCode === 200) {
			console.log("Title: ", JSON.parse(body).Title);
			console.log("Year: ", JSON.parse(body).Year);
			console.log("Rated: ", JSON.parse(body).Rated);
			console.log("IMDB Rating: ", JSON.parse(body).Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
			console.log("Metacritic Rating: ", JSON.parse(body).Ratings[2].Value);
			console.log("Country: ", JSON.parse(body).Country);
			console.log("Language: ", JSON.parse(body).Language);
			console.log("Plot: ", JSON.parse(body).Plot);
			console.log("Actors: ", JSON.parse(body).Actors);
			fs.appendFile("log.txt", "Search" + item + "\n" + "Title: " + JSON.parse(body).Title + "\n" + "Year: " + JSON.parse(body).Year + "\n" + "Rated: " + JSON.parse(body).Rated + "\n" + "IMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\n" + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" + "Metacritic Rating: " + JSON.parse(body).Ratings[2].Value + "\n" + "Country: " + JSON.parse(body).Country + "\n" + "Language: " + JSON.parse(body).Language + "\n" + "Plot: " + JSON.parse(body).Plot + "\n" + "Actors: " + JSON.parse(body).Actors, function(err) {
				if (error) {
					return console.log(error);
				}
			});
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

// do-what-it-says
// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
// BONUS

// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.
// Do not overwrite your file each time you run a command.
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
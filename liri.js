require("dotenv").config();



var keys = require("./keys");

var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var fs = require("fs")



//Breaking down the command line
var commandArgs = process.argv;
var liriCommand = commandArgs[2];
var userInputs = commandArgs[3];

switch (liriCommand) {
    case "concert-this":
        concertThis(userInputs);
        break;

    case "spotify-this-song":
        spotify(userInputs);
        break;

    case "movie-this":
        omdb(userInputs);
        break;

    case "do-what-it-says":
        doit();
        break;
};

function concertThis() {
    var queryURL = "https://rest.bandsintown.com/artists/" + userInputs + "/events?app_id=codingbootcamp"
    request(queryURL, function (error, response, body) {
        var concert = JSON.parse(body);
        if (!error && response.statusCode === 200) {
            for (var i = 0; i < concert.length; i++) {
                console.log(userInputs.toUpperCase() + " will be playing at...")
                console.log("Venue: " + concert[i].venue.name);
                console.log("Location: " + JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.region);
                console.log("Date: " + moment(JSON.parse(body)[i].datetime).format("MM/DD/YYYY"));
                console.log("\n")
            }
        }
    })
}
function spotify(userInputs) {
    var client = new Spotify(keys.spotify);
    if (!userInputs) {
        userInputs = 'The Sign';
    }
    client.search({ type: 'track', query: userInputs }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songInfo = data.tracks.items;
        console.log("\n")
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
    });
}

function omdb(userInputs) {

	var queryURL = "http://www.omdbapi.com/?t=" + userInputs + "&y=&plot=short&apikey=trilogy";

	request(queryURL, function(error, response, body) {
		if (!userInputs){
        	userInputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {
            console.log("\n")
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot Summary: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function doit() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		var dataArr = data.split(",");
 
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} else if (dataArr[0] === "my-tweets") {
			var tweetname = dataArr[1].slice(1, -1);
			twitter(tweetname);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
		
  	});

};
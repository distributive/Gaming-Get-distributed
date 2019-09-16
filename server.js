let http = require ("http");
let url = require ("url");
let fs = require ("fs");
// let express = require ("express");
let childProcess = require ("child_process");

let port = 42069;

let server = http.createServer (function (request, response) {

  let path = url.parse (request.url).pathname;
	let topPath = /^\/?([^\/]*)\/?([^\/]*)/.exec (path);
	let tailPath = topPath ? topPath[2] : '';
	topPath = topPath ? topPath[1] : '';

  // Sanitise path
  path = path.substring (1, path.length).replace (/%20/g, "\ ");

  switch (topPath)
  {
    case "":
      response.write (buildHTML ());
      response.end ();
    break;

    case "static":
    case "assets":
      if (request.url.match ("\.css$"))
      {
        var fileStream = fs.createReadStream (path, "UTF-8");
        response.writeHead (200, {"Content-Type": "text/css"});
        fileStream.pipe (response);
      }
      else if (request.url.match ("\.png$"))
      {
        var fileStream = fs.createReadStream (path);
        response.writeHead (200, {"Content-Type": "image/png"});
        fileStream.pipe (response);
      }
      else if (request.url.match ("\.jpe?g$"))
      {
        var fileStream = fs.createReadStream (path);
        response.writeHead (200, {"Content-Type": "image/jpg"});
        fileStream.pipe (response);
      }
      else
      {
        response.write (fs.readFileSync (path, "utf8"));
        response.end ();
      }
    break;
  }
}).listen (port);



function buildHTML ()
{
  // Load html templates
  let htmlTemplate = fs.readFileSync ("templates/index.tmpl", "utf8");
  let gameTemplate = fs.readFileSync ("templates/game.tmpl", "utf8");
  let tagTemplate  = fs.readFileSync ("templates/tag.tmpl", "utf8");

  // Load list of game directories
  let gameDirectories = fs.readdirSync ("assets/games", "utf8");

  // Load game data
  let games = [];
  gameDirectories.forEach (function (directory) {
    let gameData = fs.readFileSync ("assets/games/" + directory + "/data.json", "utf8");
    games.push ([directory, JSON.parse (gameData)]);
  });

  // Sort games
  games.sort (game => game[1]["name"]);

  // Stitch together the html source
  let gameHTML = "";
  games.forEach (function (game) {
    let tags = "";
    game[1]["tags"].forEach (function (tag) {
      tags += tagTemplate.replace (/@tag/g, tag);
    });

    let gameString = gameTemplate.replace (/@file/g, game[0]);
    gameString = gameString.replace (/@name/g, game[1]["name"]);
    gameString = gameString.replace (/@description/g, game[1]["description"]);
    gameString = gameString.replace (/@tags/g, tags)
    gameHTML += gameString
  });

  // Paste the list of game divs into the full html template
  return htmlTemplate.replace ("@games", gameHTML)
}

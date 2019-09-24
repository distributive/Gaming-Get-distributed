let http = require ("http");
let url = require ("url");
let fs = require ("fs");
// let express = require ("express");
let childProcess = require ("child_process");

const dcsGetBinary = "dcs-get";

let port = 42069;

let server = http.createServer (function (request, response) {

  let path = url.parse (request.url).pathname;
  let topPath = /^\/?([^\/]*)\/?([^\/]*)/.exec (path);
  let tailPath = topPath ? topPath[2] : "";
  topPath = topPath ? topPath[1] : "";

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
      serveRawData (request, response, path);
    break;

    case "steam":
      steam ();
      response.end ();
    break;

    case "volume":
      volume ();
      response.end ();
    break;

    case "mouse":
      mouse ();
      response.end ();
    break;

    case "resolution":
      fixResolution ();
      response.end ();
    break;
  }
}).listen (port);
console.log(`listening on ${port}`);



function buildHTML ()
{
  // Load html templates
  let htmlTemplate = fs.readFileSync ("templates/index.tmpl", "utf8");
  let gameTemplate = fs.readFileSync ("templates/game.tmpl", "utf8");
  let tagTemplate  = fs.readFileSync ("templates/tag.tmpl", "utf8");

  // Load list of game directories
  //let gameDirectories = fs.readdirSync ("assets/games", "utf8");
  const packageList = JSON.parse(fs.readFileSync("/var/tmp/dcs-get/packages.json", "utf8"));
  const games = {};
  for(const package of Object.keys(packageList).sort()) {
    if(packageList[package].type === "game")
      games[package] = packageList[package];
  }

  // Stitch together the html source
  let gameHTML = "";
  for(const gameName of Object.keys(games)) {
    const game = games[gameName];
    let tags = "";
    game.tags.forEach (function (tag) {
      tags += tagTemplate.replace (/@tag/g, tag);
    });

    let gameString = gameTemplate.replace (/@img/g, game["image-url"]);
    gameString = gameString.replace (/@name/g, gameName);
    gameString = gameString.replace (/@description/g, game.description);
    gameString = gameString.replace (/@tags/g, tags)
    gameHTML += gameString
  }

  // Paste the list of game divs into the full html template
  return htmlTemplate.replace ("@games", gameHTML)
}



function serveRawData (request, response, path)
{
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
}



function steam ()
{
  console.log ("Launching Steam");
  childProcess.exec ("/dcs/guest/compsoc/steam/steam&", function (err, stdout, stderr) {
    if (err)
      console.log (err);
  });
}

function volume ()
{
  console.log ("Launching gnome-control-center sound");
	childProcess.exec ("gnome-control-center sound", function (err, stdout, stderr) {
    if (err)
      console.log (err);
  });
}

function mouse ()
{
  console.log("Launching gnome-control-center mouse");
	childProcess.exec ("gnome-control-center mouse", function (err, stdout, stderr) {
    if (err)
      console.log (err);
  });
}

function fixResolution ()
{
  console.log ("Fixing resolution");
  childProcess.exec ("xrandr -s 0", function (err, stdout, stderr) {
    if (err)
      console.log (err);
  });
}

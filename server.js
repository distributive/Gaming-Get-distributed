let http = require("http");
let url = require("url");
let fs = require("fs");
// let express = require ("express");
let childProcess = require("child_process");

let port = 42069;

const installations = [];

let server = http.createServer(function(request, response) {

    let path = url.parse(request.url).pathname;
    let topPath = /^\/?([^\/]*)\/?([^\/]*)/.exec(path);
    let tailPath = topPath ? topPath[2] : "";
    topPath = topPath ? topPath[1] : "";

    // Sanitise path
    path = path.substring(1, path.length).replace(/%20/g, "\ ");

    switch (topPath) {
        case "":
            response.write(buildHTML());
            response.end();
            break;

        case "static":
        case "assets":
            serveRawData(request, response, path);
            break;

        case "steam":
            steam();
            response.end();
            break;

        case "volume":
            volume();
            response.end();
            break;

        case "mouse":
            mouse();
            response.end();
            break;

        case "resolution":
            fixResolution();
            response.end();
            break;

        case "install":
            installGame(request, response, path);
            break;

        case "status":
            status(request, response, path);
            break;

        case "launch":
            launchGame(request, response, path);
            break;

        case "check":
            checkGameInstall(request, response, path);
            break;
    }
}).listen(port);
console.log(`listening on ${port}`);

function buildHTML() {
    // Load html templates
    let htmlTemplate = fs.readFileSync(`${__dirname}/templates/index.tmpl`, "utf8");
    let gameTemplate = fs.readFileSync(`${__dirname}/templates/game.tmpl`, "utf8");
    let tagTemplate = fs.readFileSync(`${__dirname}/templates/tag.tmpl`, "utf8");

    // Load list of game directories
    const packageList = JSON.parse(fs.readFileSync("/var/tmp/dcs-get/packages.json", "utf8"));
    const games = {};
    for (const package of Object.keys(packageList).sort()) {
        if (packageList[package].type === "game")
            games[package] = packageList[package];
    }

    // Stitch together the html source
    let gameHTML = "";
    for (const gameName of Object.keys(games)) {
        const game = games[gameName];
        let tags = "";
        game.tags.forEach(function(tag) {
            tags += tagTemplate.replace(/@tag/g, tag);
        });

        let gameTitle = game["title"] || gameName;
        let gameString = gameTemplate.replace(/@img/g, game["image-url"]);
        gameString = gameString.replace(/@title/g, gameTitle);
        gameString = gameString.replace(/@description/g, game.description);
        gameString = gameString.replace(/@tags/g, tags);
        gameString = gameString.replace(/@name/g, gameName);
        gameHTML += gameString
    }

    // Paste the list of game divs into the full html template
    return htmlTemplate.replace("@games", gameHTML)
}


function serveRawData(request, response, path) {
    path = `${__dirname}/` + path
    if (request.url.match("\.css$")) {
        var fileStream = fs.createReadStream(path, "UTF-8");
        response.writeHead(200, {
            "Content-Type": "text/css"
        });
        fileStream.pipe(response);
    } else if (request.url.match("\.png$")) {
        var fileStream = fs.createReadStream(path);
        response.writeHead(200, {
            "Content-Type": "image/png"
        });
        fileStream.pipe(response);
    } else if (request.url.match("\.jpe?g$")) {
        var fileStream = fs.createReadStream(path);
        response.writeHead(200, {
            "Content-Type": "image/jpg"
        });
        fileStream.pipe(response);
    } else {
        response.write(fs.readFileSync(path, "utf8"));
        response.end();
    }
}


function steam() {
    console.log("Launching Steam");
    childProcess.exec("/dcs/guest/compsoc/steam/steam&", function(err, stdout, stderr) {
        if (err)
            console.log(err);
    });
}


function volume() {
    console.log("Launching gnome-control-center sound");
    childProcess.exec("gnome-control-center sound", function(err, stdout, stderr) {
        if (err)
            console.log(err);
    });
}


function mouse() {
    console.log("Launching gnome-control-center mouse");
    childProcess.exec("gnome-control-center mouse", function(err, stdout, stderr) {
        if (err)
            console.log(err);
    });
}


function fixResolution() {
    console.log("Fixing resolution");
    childProcess.exec("xrandr -s 0", function(err, stdout, stderr) {
        if (err)
            console.log(err);
    });
}

function status(request, response, path) {
    const game = path.match(/\/([^\/]*)$/)[1];
    const gameInfo = installations[game] || {
        progress: 0
    };

    response.setHeader('Content-type', 'application/json');
    response.write(JSON.stringify(gameInfo));
    response.end();
}

function installGame(request, response, path) {
    const game = path.match(/\/([^\/]*)$/)[1];
    installations[game] = {
        progress: 0
    };
    const process = childProcess.spawn("dcs-get", ["install", game]);
    process.stdout.on('data', data => {
        const progress = data.toString().match(/(\d+)\/(\d+)/)
        if (progress !== null)
            installations[game].progress = progress[1] / progress[2];
    });
    process.stderr.on('data', data => {
        console.log('stderr', data.toString());
    });
    process.on('close', code => {
        console.log(`Installing ${game} finished with code ${code}`);
        if (code === 0)
            installations[game].progress = 1;
    });

    response.setHeader('Content-type', 'application/json');
    response.end();
}

function launchGame(request, response, path) {
    const game = path.match(/\/([^\/]*)$/)[1];
    if (!game) {
        console.err("gameName not found");
    }
    const process = childProcess.spawn(game);
    process.on('close', code => {
        console.log(`Game: ${game} finished with code ${code}`);
    });
    response.setHeader('Content-type', 'text');
    response.write(`Launching ${game}`);
    response.end();
}

function checkGameInstall(request, response, path) {
    const game = path.match(/\/([^\/]*)$/)[1];
    const symLinkLoc = "/var/tmp/dcs-get/bin/" + game;
    var check = fs.existsSync(symLinkLoc);
    response.setHeader('Content-type', 'application/json');
    response.write(JSON.stringify({
        found: check
    }));
    response.end();
}

var http = require("http")
, fs = require("fs")
, url = require('url')
, path = require("path")
, server = http.createServer(requestListener)
, qs = require('querystring')
, req = require('request')
, mysql = require('mysql')
, io = require('socket.io')
, socket = io.listen(server)
, connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'motokokusanagi',
    database:'soccer_player'
});

connection.connect();

server.listen((process.env.PORT || 5000), function() {
    console.log((process.env.PORT || 5000) + "でサーバーが起動しました");
});

socket.sockets.on('connection', function(client){
    client.on('team', function(message){

	connection.query('select * from transfer where team like ? order by team,national,minutes desc', [ "%"+message.team_name+"%" ], function(error, results, fields) {
	    if(results){
		console.log(results);
		client.emit("result", results);
	    }
	    if(error) console.log(error);
	});
    });

    client.on('national', function(message){
	console.log(message);
	connection.query('select * from transfer where national like ? order by position,minutes desc', [ "%"+message.national+"%" ], function(error, results, fields) {
	    if(results){
		console.log(results);
		client.emit("result", results);
	    }
	    if(error) console.log(error);
	});
    });

    client.on('team_national', function(message){
	console.log(message);
	connection.query('select * from transfer where team_national like ? order by division,team,national,minutes desc', [ "%"+message.team_national+"%" ], function(error, results, fields) {
	    if(results){
		console.log(results);
		client.emit("result", results);
	    }
	    if(error) console.log(error);
	});
    });
});


function requestListener(request, response) {

    var requestURL = request.url;

    var extensionName = path.extname(requestURL);

    if(request.method=='POST') {
	var body='';
	request.on('data', function (data) {
            body += data;
	});
	request.on('end',function(){
            var POST =  qs.parse(body);
	    console.log(POST);
	});
    }

    else if(request.method=='GET') {
	var url_parts = url.parse(request.url,true).pathname;
    }


    switch(extensionName)
    {
    case ".html":
	readFileHandler(requestURL, "text/html", false, response);
	break;
    case ".css":
	readFileHandler(requestURL, "text/css", false, response);
	break;
    case ".js":
    case ".ts":
	readFileHandler(requestURL, "text/javascript", false, response);
	break;
    case ".png":
	readFileHandler(requestURL, "image/png", true, response);
	break;
    case ".jpg":
	readFileHandler(requestURL, "image/jpeg", true, response);
	break;
    case ".gif":
	readFileHandler(requestURL, "image/gif", true, response);
	break;
    case ".csv":
	readFileHandler(requestURL, "text/csv", true, response);
	break;
    case ".json":
	readFileHandler(requestURL, "application/json", false, response);
	break;
    case ".svg":
	readFileHandler(requestURL, "image/svg+xml", true, response);
	break;
    case ".mp3":
	readFileHandler(requestURL, "audio/mpeg", true, response);
	break;
    default:
	// どこにも該当しない場合は、index.htmlを読み込む
	readFileHandler("/index.html", "text/html", false, response);
	break;
    }

}

/**
 * ファイルの読み込み
 */

function readFileHandler(fileName, contentType, isBinary, response) {

    var encoding = !isBinary ? "utf8" : "binary";
    var filePath = __dirname + fileName;

    fs.exists(filePath, function(exists) {
        if(exists)
        {
            fs.readFile(filePath, {encoding: encoding}, function (error, data) {
                if (error) {
                    response.statusCode = 500;
                    response.end("Internal Server Error");
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", contentType);
                    if(!isBinary)
                    {
                        response.end(data);
                    }
                    else
                    {
                        response.end(data, "binary");
                    }
                }
            });
        }
        else
        {
            // ファイルが存在しない場合は400エラーを返す。
            response.statusCode = 400;
            response.end("400 Error");
        }
    });
}

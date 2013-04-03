var http = require('http');
var url = require('url');
var fs = require('fs');
var index = fs.readFileSync('admin.html');
var path = require("path");

http.createServer(function(request, response) {
    lVars = url.parse(request.url, true);
    
    if (lVars.query.action) {
        console.log('action = ' + lVars.query.action);

        if (lVars.query.action == 'content') {
            var file = fs.readFileSync(__dirname + '/lib/tracker/settings.json', "utf8");
            var config = JSON.parse(file);
            response.writeHead(200,{
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
            response.write(JSON.stringify(config));
            response.end();   
        }
        else if (lVars.query.action == 'add') {
            console.log('ip ' + lVars.query.ip);
            console.log('port ' + lVars.query.port);
            console.log('type ' + lVars.query.type);

            var ans = {};

            var file = fs.readFileSync(__dirname + '/lib/tracker/settings.json', "utf8");
            var config = JSON.parse(file);

            for (var i in config) {
                var server = config[i];

                if (server.ip == lVars.query.ip  && server.port == lVars.query.port) {
                    console.log('add found');
                    ans['status'] = 'exists';

                    response.writeHead(200,{
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    response.write( JSON.stringify(ans) );
                    response.end();
                    return;
                } 
            }

            console.log('add not found');
            var newServer = {};
            newServer['ip'] = lVars.query.ip;
            newServer['port'] = lVars.query.port;
            newServer['type'] = lVars.query.type;

            config.push(newServer);

            console.log( JSON.stringify(config) );

            fs.writeFile(__dirname + '/lib/tracker/settings.json', JSON.stringify(config) , function(err) {
                if(err) {
                    console.log(err);
                    ans['status'] = 'err';

                    response.writeHead(200,{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                    response.write(JSON.stringify(ans));
                    response.end();
                } else {
                    console.log("The file was saved!");
                    ans['status'] = 'success';
                    ans['servers'] = config;

                    response.writeHead(200,{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                    response.write(JSON.stringify(ans));
                    response.end();
                }
            });
        }
      
        else if (lVars.query.action == 'save') {
            console.log('host ' + lVars.query.host);
            console.log('ip ' + lVars.query.ip);
            console.log('port ' + lVars.query.port);
            console.log('type ' + lVars.query.type);
            
            var ans = {};

            var file = fs.readFileSync(__dirname + '/lib/tracker/settings.json', "utf8");
            var config = JSON.parse(file);

            var data = lVars.query.host.split(':');

            for (var i in config) {
                var server = config[i];

                if (server.ip == lVars.query.ip  && server.port == lVars.query.port) {
                    ans['status'] = 'exists';

                    response.writeHead(200,{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                    response.write(JSON.stringify(ans));
                    response.end();
                  
                    return;
                } 
            }

            for (var i in config) {
                var server = config[i];

                if (server.ip == data[0]  && server.port == data[1]) {
                  server.ip = lVars.query.ip;
                  server.port = lVars.query.port;
                  server.type = lVars.query.type;
                  break;
                } 
            }

            console.log( JSON.stringify(config) );

            fs.writeFile(__dirname + '/lib/tracker/settings.json', JSON.stringify(config) , function(err) {
                if(err) {
                    console.log(err);
                    ans['status'] = 'err';

                    response.writeHead(200,{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                    response.write(JSON.stringify(ans));
                    response.end();
                } else {
                    console.log("The file was saved!");
                    ans['status'] = 'success';
                    ans['servers'] = config;

                    response.writeHead(200,{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            });
                    response.write(JSON.stringify(ans));
                    response.end();
                }
            });
        }
    }

    else {
        response.writeHead(200, {'Content-Type': 'text/html'});
      	response.end(index);
    }
}).listen(9615);
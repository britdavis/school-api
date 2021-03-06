/* jshint esversion:6 */

var http = require("http");
var fs = require("fs");
var url = require("url");

var grades = 
	{
    algebra : "A",
    "p.e." : "C",
    english : "B"
	};

var homework =
	{
	algebra: true,
	"p.e" : false,
	english: true,
	};	

var server = http.createServer((req,res) => {
	if (req.url === "/" || req.url === "/index.html") {
		fs.readFile("index.html", (err, data) => {
			res.write(data);
			res.end();
	});



	} else if (req.url === "/grades") {
		res.write(JSON.stringify(grades));
		res.end();

	} else if (req.url === "/homework" && req.method === "POST") {
		var queryData = "";

		req.on('data', function(data) {
			queryData += data;
			if(queryData.length > 1e6) {
				queryData = "";
				res.writeHead(413, {'Content-Type': 'text/plain'}).end();
				req.connection.destroy();
			}
		});

			req.on('end', function() {
				grades[queryData] = "C"; 
				homework[queryData] = true;
			res.write("success");
			res.end();	
			});


	} else if (req.url === "/homework") {
		res.write(JSON.stringify(homework));
		res.end();

	} else if (req.url ==="/schedule" && req.method ==="POST") {
			var queryData = "";

			req.on('data', function(data) {
				queryData += data;
				if(queryData.length > 1e6) {
					queryData = "";
					res.writeHead(413, {'Content-Type': 'text/plain'}).end();
					req.connection.destroy();
				}
			});

			req.on('end', function() {
				// need to change this to add class to grades object
				//fortunes.push(queryData);
				grades[queryData] = ""; 
				homework[queryData] = false;
				res.write("success");
				res.end();
		});

	} else if (req.url === "/schedule") {
			res.write(JSON.stringify(Object.keys(grades)));
			res.end();
		
	} else {
		res.write("This is Brit's school-api server");
		res.end();
	} 
});

server.listen(8000, () => {
	console.log("Server started on port 8000");
});
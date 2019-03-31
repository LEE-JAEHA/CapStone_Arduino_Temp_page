var fs = require('fs');
var express = require('express');
var date = require('date-and-time');
var app = express();
var mysql = require('mysql');
var d3 = require("d3");
var moment = require('moment');
var now = moment();
var secure = require("./jaehalee.js");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.set("views", "./views");






var connection = mysql.createConnection(secure);
connection.connect();
app.engine('html',require('ejs').renderFile);

app.get('/', function (req, res) {
		console.log("IHIHIH");
		res.send('Hello World!');
});

app.get('/log', function(req,res){
	console.log(req.query);
	var now = new Date();
	now = date.addHours(now,9);
	console.log(date.format(now,"YYYY/MM/DD/HH/mm/ss"));
	var querydata = {};
	querydata.daytime = now;
	querydata.temper = req.query.temp;
	
	sql = "insert into capstone2 set ?";
	console.log("\n\n");
	console.log(querydata);
	console.log("\n\n");
	connection.query(sql,querydata, (err, rows, fields) => {
		if(err){
			console.log(err);
			return res.end();
			throw err;
        }
    })
});

app.get('/graph', function(req,res){
	console.log("graph=" + req.query);
	var html = fs.readFile('./views/graph.html',function(err,html){
		var qstr = 'select * from capstone2 order by daytime';
		html = " "+html
		console.log('read end');
		connection.query(qstr, function(err, rows, cols) {
			if (err) {
				res.send('query error: '+ qstr);
				throw err;
			}
			var data = "";
			var comma = "";
			var start = rows[0].daytime;
			var end = rows[rows.length-1].daytime;
			for ( var i = 0 ; i < rows.length ; i++){
				r = rows[i];
				if(rows[i].temper>max)
					max = rows[i].temper;
				if(rows[i].temper<min)
					min = rows[i].temper;
				now = moment(rows[i].daytime).add(9,'hours').add(-1,'month');
				data += comma + "[new Date(" + now.format('YYYY,MM,DD,HH,mm') + ",)," + r.temper + "]";
				comma = ",";
			}
			var header = "data.addColumn('date', 'Date/Time');"
			header += "data.addColumn('number', 'Temperature');"
			html = html.replace("<%HEADER%>",header);
			html = html.replace("<%DATA%>",data);
			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(html);
			res.end();
		});
	});
});



var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('listening at http://%s:%s', host, port);  
});

/*
app.get('/graph', (req,res)=>{
		console.log(req.query);
		var count = req.query.count;
		var cnt = count;
		var timeData =[];
		var temperData =[];
		var dataa = [];
		var result = {};
		fs.readFile('log.txt','utf-8', function(err,data){
				if(err) throw err;
				var array = data.toString().split('\n');
				var arrsize = array.length;
				console.log(count);
				console.log(arrsize);
				if(count > arrsize-1){
					result["error"]="there are less data than count\n";
					cnt = arrsize-1;
				}
				for(var i=0;i<cnt;i++){
					var tmp = array[arrsize-2-i].split(' ');
					timeData.push(new Date(tmp[0]+" "+tmp[1]));
					temperData.push(parseFloat(tmp[2]));
					dataa.push(array[arrsize-2-i]);
				}
				result["data"] = dataa;
				result["time"]=timeData;``
				result["temper"]=temperData;
				console.log(result);
				
		//		res.send(result);
				res.render("graph",{result});
		});
});
*/


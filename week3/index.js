var express = require('express');
var fs = require('fs');
var date = require('date-and-time');
var app = express();
var mysql = require('mysql');
var d3 = require("d3");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.set("views", "./views");

var connection = mysql.createConnection({
	host : "jaehalee.cwys1zlqyezi.ap-northeast-2.rds.amazonaws.com",
	user : "jaehalee",
	password : "jaeha30739",
	database : "jaehalee"
})
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
	querydata.time = now;
	querydata.value = req.query.temp;
	sql = "insert into capstone set ?";
	connection.query(sql,querydata, (err, rows, fields) => {
		if(err){
			console.log(err);
			return res.end();
			throw err;
        }
    })
});

app.get('/graph', function(req,res){
	console.log("HI");
	console.log(req.query);
	var sql = "select time_t temper from capstone order by time_t DESC limit 120;"	
	connection.query(sql, (err, rows, fields) => {
		if(err){
			console.log("   \n");
			console.log(err);
			throw err;
		}
		console.log("this is \n\n");
		console.log(rows);
		console.log("hihihih\n\n");
		var arrsize = rows.length;
		for(var i=0;i<arrsize;i++){
			if(i==arrsize-1) 
				max = rows[i].time;
			if(i==0) 
				min = rows[i].time;
		}
		res.render('graph',{'result' : rows, 'min' : min, 'max' : max});
		//result에 row의 데이터를 보낸다.
		//console.log(min,max);
	})
});



app.listen(3000, function () {
		console.log('Example app listening on port 3000!\n');
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

ar express = require('express');

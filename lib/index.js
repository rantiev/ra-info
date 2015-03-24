"use strict";

var path = require('path'),
	clc  = require('cli-color'),
	request = require('request'),
	cheerio = require('cheerio'),
	resources = [
		{
			title:'BYR/USD: ',
			url:'nbrb.by',
			find: '#BodyHolder_tblRates tr:nth-child(2) td:last-child',
			color:'green'
		},
		{
			title:'Weather: ',
			url:'pogoda.tut.by',
			find: '.b-fcurrent .fcurrent-top .fcurrent-temp span',
			color:'cyanBright'
		}
	];

function run(){

	resources.forEach(function(res){

		var normUrl = !~res.url.indexOf('http://') ? 'http://' + res.url : res.url;

		request.get(normUrl, function(err, response, body){

			if(err){
				console.log(err);
			} else if(response.statusCode == 200) {
				var $ = cheerio.load(body);
				console.log(clc[res.color](res.title + $(res.find).text() ));
			} else {
				console.log('There were problems with loading ' + res.url  + ' resource! Try another day!');
			}

		});

	});

}

module.exports = {
	run:run
};

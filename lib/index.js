"use strict";

//Обычно все-таки рекомендуют каждую переменную со своим var. + стандарт iTechArt также об этом говорит.
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

//Можно немножко улучшить run.
//Поспольку мы пишем node.js может быть два сценария.
//1) когда выполнили node ourModule.js т.е. когда наш файл вызвали из командной строки как приложение
//	тогда этот метод, или то, что у него внутри, должно выполниться по умолчанию
//2) когда сделали reuire(ourModule)
//	тогда по умолчанию ничего не должно вполниться
//В общем я бы посоветовал сделать проверочку:
//if (!module.parent) //Значит нас не зарекваерили, выполняем run();
//else ... //Значит нас зарекваерили, не будем вызывать run();
//В общем в таком духе пишут многие библиотеки, которые могут ставиться и использоваться, например, глобально
function run(){

	resources.forEach(function(res){

		//!~ Четко :) Видно, что человек на js порядочно пописал. :)
		var normUrl = !~res.url.indexOf('http://') ? 'http://' + res.url : res.url;

		request.get(normUrl, function(err, response, body){
            		//Нужно стараться избегать else statements.
            		//Статься на эту тему: http://williamdurand.fr/2013/06/03/object-calisthenics/
        		//Аналогичную статью можно нагуглить по JS.
            		//В Node.js принято писать if (err) { return что-нибудь }
            		//А дальше без else логика которая обрабатывает ситуацию без ошибок
            		
            		//Тогда код становится гораздо проще. Нет вложенности ифов.
			if(err){
				console.log(err);
				//Рекомендуется всегда использовать ===
			} else if(response.statusCode == 200) {
				var $ = cheerio.load(body);
				console.log(clc[res.color](res.title + $(res.find).text() ));
			} else {
				//Мне кажется чуточку сексапильнее писать так:
				//console.log('There were problems with loading %s resource! Try another day!', res.url);
				console.log('There were problems with loading ' + res.url  + ' resource! Try another day!');
			}

		});

	});

}

module.exports = {
	run:run
};

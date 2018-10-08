//虚拟天气
function getWeatherData(){
	return {
		locations:[
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)'
			},
			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)'
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)'
			}
		]
	};
}

var express = require('express');
//var handlebars = require('express-handlebars');

//添加post请求插件
var bodyparser = require('body-parser');

//添加文件传输插件
var formidable = require('formidable');


var app = express();

var handlebars = require('express-handlebars').create({
	defaultLayout: 'main',
    extname: '.hbs',
	helpers: {
	       section: function(name, options){
	            if(!this._sections) this._sections = {};
	            this._sections[name] = options.fn(this);
	            return null;
	       }
	    }
});

//添加static中间价
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//设置handlebars视图引擎
app.engine('hbs',handlebars.engine);
// app.engine('hbs', handlebars({
//   defaultLayout: 'main',
//   extname: '.hbs'
// }));
app.set('view engine', 'hbs');

app.set('port',process.env.PORT || 3000);

//添加测试路径
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

//天气中间介
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials = getWeatherData(); 
	next();
});

//添加路由
// app.get('/',function(req,res){
// 	res.type('text/html');
// 	res.send('<h2>你在首页里</h2>');
// });
app.get('/',function(req,res){
	res.render('home',{layout:null});
});
app.get('/jquery',function(req,res){
	res.render('jquerytest');
});
app.get('/about', function(req, res){ 
    res.render('about',{
    	pageTestScript:'/qa/tests-about.js'
    });
});
app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});

//段落
app.get('/nursery-rhyme', function(req, res){
           res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
        res.json({
                    animal: 'squirrel',
                    bodyPart: 'tail',
                    adjective: 'bushy',
                    noun: 'heck',
        });
});

//express表单处理
app.get('/newsletter',function(req,res){
	res.render('newsletter',{csrf: 'CSRF token goes here'});
});
app.post('/process',function(req,res){
	console.log('Form(from querystring):' + req.query.form);
	console.log('csrk token:' + req.body._csrf);
	console.log('name:' + req.body.name);
	console.log('email:' + req.body.email);
	res.redirect(303,'/');
});

//处理ajax表单
app.get('/newsletter1',function(req,res){
	res.render('newsletter1',{csrf: 'CSRF token goes here'});
});
app.post('/process1',function(req,res){
	if(req.xhr || req.accepts('json,html') === 'json'){
		//如果发生错误，应该发送error
		res.send({success:true});
		console.log(req.body.name);
	}else{
		//如果发生错误，应该重定向到错误页面
		res.redirect(303,'/about');
	}
});

//文件传输
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year:now.getFullYear(),month:now.getMonth()
	});
});
app.post('/contest/vacation-photo/:year/:month',function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err){
			return res.redirect(303,'/error');
		}
		console.log('获取fields');
		console.log(fields);
		console.log('获取files');
		console.log(files);
		res.redirect(303,'/');
	})
})

//定制404页面
app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('监听. http://localhost:' + app.get('port'));
});
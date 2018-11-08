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

//添加jQuery插件上传(未实现)
var jqupload = require('jquery-file-upload-middleware');

//添加凭证文件
var credentials = require('./models/credentials');

//引入邮箱插件
var nodemailer = require('nodemailer');
//创建传输方式
var transporter = nodemailer.createTransport({
	service: 'qq',
	auth: {
		user: credentials.qq.user,
		pass: credentials.qq.pass
	}
});


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

//添加cookie中间件和session
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
	name: 'yike',
	secret: 'abc_def',
	resave: true,
	cookie: {maxAge:60*1000,httpOnly:true}
}));

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


//汇总路由文件routes.js
require('./routes.js')(app);


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
var fileServe = require('./lib/file');
app.post('/contest/vacation-photo/:year/:month',function(req,res){
	fileServe.form(req,res);
});

//cookie测试
app.get('/cookie',function(req,res){
 	if(req.session.isFirst || req.signedCookies.isFirst){
 		res.render('testcookie',{
 			well : '再次访问',
			name : req.cookies.name,
			about: req.signedCookies.about
		});	
 	}else{
 		req.session.isFirst = 1;
 		res.cookie('isFirst',1,{maxAge:10000,signed:true});
 		res.render('testcookie',{
 			well : '第一次访问',
			name : req.cookies.name,
			about: req.signedCookies.about
		});	
 	}
});

//邮件发送测试
app.get('/send',function(req,res,next){
	var options = {
		from : '1334785356@qq.com',
		to : '2098933249@qq.com',
		subject : '来自我express mail 测试',
		text : '来自我express mail 测试',
		html : '<h3>你好，我来看下。</h3><p style="font-size:30px">哈哈</p><p><img src="cid:00001"/></p>',
		attachments: [
			{
				filename: 'logo.jpg',
				path: 'public/img/logo.jpg',
				cid: '00001'
			},
			{
				filename: '123.jpg',
				path: 'public/img/123.jpg',
				cid: '00002'
			},
		]
	};
	transporter.sendMail(options,function(err,msg){
		if(err){
			console.log(err);
			res.render('send',{title: '发生错误'});
		}else{
			console.log(msg);
			res.render('send',{title:'发送成功！'+msg.accepted})
		}
	});
});

app.get('/email',function(req,res){
	res.render('email');
});

// var emailService = require('./lib/email.js')(credentials);
app.post('/emailsend',function(req,res){
	// if(!req.session.isFirst){
	// 	next(new Error('没有访问coosie'));
	// }
	var title = req.body.title , email = req.body.email , main = req.body.main;
	// emailService.send(email,title,main);
	var options = {
		from : '1334785356@qq.com',
		to : email,
		subject : title,
		text : title,
		html : main
	};
	transporter.sendMail(options,function(err,msg){
		if(err){
			console.log(err);
			res.render('send',{title: '发生错误'});
		}else{
			console.log(msg);
			res.render('send',{title:'发送成功！'+msg.accepted})
		}
	});
});

//链接数据库操作
var Vacation = require('./models/vacation.js');
app.get('/vacations',function(req,res){
	Vacation.find({ available: true }, function(err, vacations){
		var context = {
			vacations: vacations.map(function(vacation){
				return {
					sku: vacation.sku,
					name: vacation.name,
					description: vacation.description,
					price: vacation.getDisplayPrice(),
					inSeason: vacation.inSeason,
				}
			})
		};
		res.render('vacations', context);
	});
});

//添加数据库
var Listener = require('./models/listener.js');
app.get('/listener',function(req,res){
	console.log(req.query.sku);
	res.render('listener',{sku:req.query.sku});
});
app.post('/listener',function(req,res){
	Listener.updateOne(
		{email: req.body.email},
		{$push:{skus:req.body.sku}},
		{upsert:true},
		function(err){
			if(err) {
				console.error(err.stack);
				req.session.flash = {
					type: 'danger',
					intro: 'Ooops!',
					message: 'There was an error processing your request.',
				};
				return res.redirect(303, '/vacations');
			}
			req.session.flash = {
				type: 'success',
				intro: 'Thank you!',
				message: 'You will be notified when this vacation is in season.',
			};
			return res.redirect(303, '/vacations');
		}
	)
});

//路由参数
var staff = {
mitch: { bio: 'Mitch is the man to have at your back in a bar fight.' },
madeline: { bio: 'Madeline is our Oregon expert.' },
walt: { bio: 'Walt is our Oregon Coast expert.' },
};
//访问http://127.0.0.1:3000/staff/mitch
app.get('/staff/:name', function(req, res, next){
var info = staff[req.params.name];
console.log(req.params.name);
console.log(info.bio);
if(!info) return next(); // 最终将会落入 404
res.render('home', info);
})

//自动化渲染视图
var autoViews = {};
var fs = require('fs');
app.use(function(req,res,next){
	var path = req.path.toLowerCase();
	// 检查缓存；如果它在那里，渲染这个视图
	if(autoViews[path]) return res.render(autoViews[path]);
	// 如果它不在缓存里，那就看看有没有.handlebars 文件能匹配
	if(fs.existsSync(__dirname + '/views' + path + '.hbs')){
		autoViews[path] = path.replace(/^\//, '');
		return res.render(autoViews[path]);
	}
	// 没发现视图；转到404 处理器
	next();
});

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
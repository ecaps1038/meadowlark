var express = require('express');
var handlebars = require('express-handlebars');

var app = express();

//添加static中间价
app.use(express.static(__dirname + '/public'));

//设置handlebars视图引擎
app.engine('hbs', handlebars({
  //layoutsDir: 'views/layouts',
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.set('port',process.env.PORT || 3000);

//添加测试路径
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

//添加路由
// app.get('/',function(req,res){
// 	res.type('text/html');
// 	res.send('<h2>你在首页里</h2>');
// });
app.get('/',function(req,res){
	res.render('home');
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